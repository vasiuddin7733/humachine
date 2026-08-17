from __future__ import annotations

from dataclasses import dataclass, field
from itertools import count

from app.schemas.product import (
    ChannelState,
    ListingStatus,
    Marketplace,
    Product,
    ProductCreate,
    PromotionStatus,
)


def _default_channels() -> dict[Marketplace, ChannelState]:
    return {marketplace: ChannelState() for marketplace in Marketplace}


@dataclass
class CatalogStore:
    _id_sequence: count = field(default_factory=lambda: count(1))
    _products: dict[int, Product] = field(default_factory=dict)

    def seed(self) -> None:
        if self._products:
            return

        seeded = [
            Product(
                id=next(self._id_sequence),
                sku="SKU-ELEC-101",
                title="Noise Cancelling Headphones",
                category="Electronics",
                price=129.99,
                marketplaces=[Marketplace.amazon, Marketplace.flipkart],
                channels={
                    **_default_channels(),
                    Marketplace.amazon: ChannelState(listing_status=ListingStatus.ready),
                    Marketplace.flipkart: ChannelState(listing_status=ListingStatus.submitted),
                },
            ),
            Product(
                id=next(self._id_sequence),
                sku="SKU-HOME-102",
                title="Reusable Water Bottle",
                category="Home & Kitchen",
                price=24.50,
                marketplaces=[Marketplace.amazon, Marketplace.flipkart, Marketplace.meesho],
                channels={
                    **_default_channels(),
                    Marketplace.amazon: ChannelState(
                        listing_status=ListingStatus.active,
                        promotion_status=PromotionStatus.scheduled,
                    ),
                    Marketplace.flipkart: ChannelState(
                        listing_status=ListingStatus.active,
                        promotion_status=PromotionStatus.live,
                    ),
                    Marketplace.meesho: ChannelState(listing_status=ListingStatus.ready),
                },
            ),
        ]

        for product in seeded:
            self._products[product.id] = product

    def list_products(self) -> list[Product]:
        return list(self._products.values())

    def get_product(self, product_id: int) -> Product | None:
        return self._products.get(product_id)

    def create_product(self, payload: ProductCreate) -> Product:
        product_id = next(self._id_sequence)
        channels = _default_channels()
        product = Product(
            id=product_id,
            sku=f"SKU-{payload.category[:4].upper()}-{100 + product_id}",
            title=payload.title.strip(),
            category=payload.category.strip(),
            price=payload.price,
            marketplaces=payload.marketplaces,
            channels=channels,
        )
        self._products[product_id] = product
        return product

    def advance_listing(self, product_id: int, marketplace: Marketplace) -> Product:
        product = self._require_marketplace(product_id, marketplace)
        channel = product.channels[marketplace]

        next_status = {
            ListingStatus.draft: ListingStatus.ready,
            ListingStatus.ready: ListingStatus.submitted,
            ListingStatus.submitted: ListingStatus.active,
            ListingStatus.active: ListingStatus.active,
        }[channel.listing_status]

        updated = product.model_copy(
            update={
                "channels": {
                    **product.channels,
                    marketplace: channel.model_copy(update={"listing_status": next_status}),
                }
            }
        )
        self._products[product_id] = updated
        return updated

    def advance_promotion(self, product_id: int, marketplace: Marketplace) -> Product:
        product = self._require_marketplace(product_id, marketplace)
        channel = product.channels[marketplace]

        if channel.listing_status is not ListingStatus.active:
            raise ValueError("Listing must be active before promotion can start.")

        next_status = {
            PromotionStatus.not_started: PromotionStatus.scheduled,
            PromotionStatus.scheduled: PromotionStatus.live,
            PromotionStatus.live: PromotionStatus.live,
        }[channel.promotion_status]

        updated = product.model_copy(
            update={
                "channels": {
                    **product.channels,
                    marketplace: channel.model_copy(update={"promotion_status": next_status}),
                }
            }
        )
        self._products[product_id] = updated
        return updated

    def _require_marketplace(self, product_id: int, marketplace: Marketplace) -> Product:
        product = self.get_product(product_id)
        if product is None:
            raise KeyError(f"Product {product_id} not found.")

        if marketplace not in product.marketplaces:
            raise ValueError(f"Marketplace {marketplace.value} is not configured for this product.")

        return product


catalog_store = CatalogStore()
catalog_store.seed()
