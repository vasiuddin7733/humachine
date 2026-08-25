from __future__ import annotations

from app.config import settings
from app.schemas.product import IngestionResult, Product, ProductCreate
from app.services.catalog import catalog_store
from app.services.message_queue import message_queue
from app.services.status_tracker import status_tracker

from app.agents.dispatch_agent import dispatch_agent

CATALOG = "catalog_service"
LISTING = "listing_service"
PROMOTION = "promotion_service"
WORKER = "worker_service"
TRACKED_SERVICES = [CATALOG, LISTING, PROMOTION, WORKER]


class ProductIngestionAgent:
    """Agent 1: after image/content upload, validate, store draft, enqueue downstream work."""

    def ingest(self, payload: ProductCreate) -> IngestionResult:
        if not payload.image_urls:
            raise ValueError("At least one image_url is required for product upload.")
        if not payload.description.strip():
            raise ValueError("Product content/description is required for upload.")

        product = catalog_store.create_product(payload)
        run = status_tracker.start_run(product.id, TRACKED_SERVICES)

        if not settings.orchestration_enabled:
            for service in TRACKED_SERVICES:
                status_tracker.mark_completed(run.id, service, "Orchestration disabled")
            return self._result(product)

        self._enqueue_catalog(run.id, product.id, payload)
        for marketplace in product.marketplaces:
            self._enqueue_marketplace_steps(run.id, product.id, marketplace.value, payload)

        dispatch_agent.dispatch_queued()
        return self._result(product)

    def _enqueue_catalog(self, run_id: int, product_id: int, payload: ProductCreate) -> None:
        message_queue.publish(
            {
                "run_id": run_id,
                "target": CATALOG,
                "product_id": product_id,
                "daily_budget": payload.daily_budget,
                "auto_activate_listings": payload.auto_activate_listings,
            }
        )

    def _enqueue_marketplace_steps(
        self,
        run_id: int,
        product_id: int,
        marketplace: str,
        payload: ProductCreate,
    ) -> None:
        body = {
            "run_id": run_id,
            "product_id": product_id,
            "marketplace": marketplace,
            "daily_budget": payload.daily_budget,
            "auto_activate_listings": payload.auto_activate_listings,
        }
        for target in (LISTING, PROMOTION, WORKER):
            message_queue.publish({"target": target, **body})

    def _result(self, product: Product) -> IngestionResult:
        runs = [run for run in status_tracker.list_runs() if run.product_id == product.id]
        return IngestionResult(
            product=catalog_store.get_product(product.id) or product,
            run=runs[-1],
        )


product_ingestion_agent = ProductIngestionAgent()
