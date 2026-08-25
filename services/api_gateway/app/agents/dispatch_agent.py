from __future__ import annotations

import httpx

from app.config import settings
from app.schemas.product import IngestionRun, ListingStatus, Marketplace, Product, PromotionStatus
from app.services.catalog import catalog_store
from app.services.message_queue import message_queue
from app.services.status_tracker import status_tracker

CATALOG = "catalog_service"
LISTING = "listing_service"
PROMOTION = "promotion_service"
WORKER = "worker_service"


class DispatchAgent:
    """Agent 2: consume queue messages, call downstream services, track per-service status."""

    def dispatch_queued(self) -> None:
        context: dict[str, dict] = {}
        for message in message_queue.drain():
            self.handle_message(message, context)

    def handle_message(self, message: dict, context: dict[str, dict]) -> None:
        target = message["target"]
        run_id = int(message["run_id"])
        product = catalog_store.get_product(int(message["product_id"]))
        if product is None:
            status_tracker.mark_failed(run_id, target, "Product missing")
            return

        status_tracker.mark_running(run_id, target)
        try:
            if target == CATALOG:
                payload = self._sync_catalog(product)
            elif target == LISTING:
                payload = self._sync_listing(product, message, context)
            elif target == PROMOTION:
                payload = self._sync_promotion(product, message, context)
            else:
                payload = self._sync_worker(product, message, context)
            status_tracker.mark_completed(run_id, target, f"{target} accepted request", payload)
        except Exception as exc:  # noqa: BLE001 - persist failure on the tracked step
            status_tracker.mark_failed(run_id, target, str(exc))

    def get_status(self, run_id: int) -> IngestionRun:
        run = status_tracker.get_run(run_id)
        if run is None:
            raise KeyError(f"Ingestion run {run_id} not found.")
        return run

    def _sync_catalog(self, product: Product) -> dict:
        return self._post(
            f"{settings.catalog_service_url}{settings.api_prefix}/products",
            {
                "title": product.title,
                "category": product.category,
                "price": product.price,
                "marketplaces": [item.value for item in product.marketplaces],
                "description": product.description,
                "image_urls": product.image_urls,
            },
        )

    def _sync_listing(self, product: Product, message: dict, context: dict[str, dict]) -> dict:
        marketplace = Marketplace(message["marketplace"])
        listing = self._post(
            f"{settings.listing_service_url}{settings.api_prefix}/listings",
            {
                "product_id": product.id,
                "sku": product.sku,
                "title": product.title,
                "marketplace": marketplace.value,
                "price": product.price,
            },
        )
        listing_id = int(listing["id"])
        context.setdefault(marketplace.value, {})["listing_id"] = listing_id

        if message.get("auto_activate_listings", True):
            current = listing
            for _ in range(3):
                if current.get("status") == ListingStatus.active.value:
                    break
                current = self._post(
                    (
                        f"{settings.listing_service_url}{settings.api_prefix}"
                        f"/listings/{listing_id}/publish"
                    ),
                    {},
                )
            listing = current
            while True:
                current_product = catalog_store.get_product(product.id)
                if current_product is None:
                    break
                if current_product.channels[marketplace].listing_status is ListingStatus.active:
                    break
                catalog_store.advance_listing(product.id, marketplace)
        return listing

    def _sync_promotion(self, product: Product, message: dict, context: dict[str, dict]) -> dict:
        marketplace = Marketplace(message["marketplace"])
        listing_id = context.get(marketplace.value, {}).get("listing_id")
        if listing_id is None:
            raise ValueError("listing_id is required before creating a campaign.")

        campaign = self._post(
            f"{settings.promotion_service_url}{settings.api_prefix}/campaigns",
            {
                "product_id": product.id,
                "listing_id": listing_id,
                "sku": product.sku,
                "title": product.title,
                "marketplace": marketplace.value,
                "daily_budget": message.get("daily_budget", 20.0),
                "listing_is_active": True,
            },
        )
        context.setdefault(marketplace.value, {})["campaign_id"] = campaign.get("id")
        current = catalog_store.get_product(product.id)
        if current and current.channels[marketplace].promotion_status is PromotionStatus.not_started:
            catalog_store.advance_promotion(product.id, marketplace)
        return campaign

    def _sync_worker(self, product: Product, message: dict, context: dict[str, dict]) -> dict:
        marketplace = Marketplace(message["marketplace"])
        listing_id = context.get(marketplace.value, {}).get("listing_id")
        campaign_id = context.get(marketplace.value, {}).get("campaign_id")
        jobs = [
            {
                "job_type": "inventory_sync",
                "product_id": product.id,
                "marketplace": marketplace.value,
                "sku": product.sku,
            }
        ]
        if listing_id is not None:
            jobs.append(
                {
                    "job_type": "sync_listing",
                    "product_id": product.id,
                    "listing_id": listing_id,
                    "marketplace": marketplace.value,
                    "sku": product.sku,
                }
            )
        if campaign_id is not None:
            jobs.append(
                {
                    "job_type": "sync_promotion",
                    "product_id": product.id,
                    "listing_id": listing_id,
                    "campaign_id": campaign_id,
                    "marketplace": marketplace.value,
                    "sku": product.sku,
                }
            )
        created = [
            self._post(f"{settings.worker_service_url}{settings.api_prefix}/jobs", job)
            for job in jobs
        ]
        return {"jobs": created}

    def _post(self, url: str, body: dict) -> dict:
        with httpx.Client(timeout=settings.http_timeout_seconds) as client:
            response = client.post(url, json=body)
        if not response.is_success:
            raise RuntimeError(f"{url} returned {response.status_code}: {response.text}")
        payload = response.json() if response.content else {}
        return payload if isinstance(payload, dict) else {"data": payload}


dispatch_agent = DispatchAgent()
