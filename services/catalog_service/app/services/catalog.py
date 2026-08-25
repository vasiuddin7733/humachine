from __future__ import annotations

from dataclasses import dataclass, field
from itertools import count

from app.schemas.product import (
    ChannelState,
    ListingStatus,
    Marketplace,
    Product,
    ProductCreate,
    ProductUpdate,
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
        product = Product(
            id=product_id,
            sku=f"SKU-{payload.category[:4].upper()}-{100 + product_id}",
            title=payload.title.strip(),
            category=payload.category.strip(),
            price=payload.price,
            marketplaces=payload.marketplaces,
            channels=_default_channels(),
            description=payload.description.strip(),
            image_urls=list(payload.image_urls),
        )
        self._products[product_id] = product
        return product

    def update_product(self, product_id: int, payload: ProductUpdate) -> Product:
        product = self.get_product(product_id)
        if product is None:
            raise KeyError(f"Product {product_id} not found.")

        updates = payload.model_dump(exclude_unset=True)
        if not updates:
            raise ValueError("At least one field is required to update a product.")

        if "title" in updates and updates["title"] is not None:
            updates["title"] = updates["title"].strip()
        if "category" in updates and updates["category"] is not None:
            updates["category"] = updates["category"].strip()
        if "description" in updates and updates["description"] is not None:
            updates["description"] = updates["description"].strip()

        if "marketplaces" in updates and updates["marketplaces"] is not None:
            channels = dict(product.channels)
            for marketplace in updates["marketplaces"]:
                if marketplace not in channels:
                    channels[marketplace] = ChannelState()
            updates["channels"] = channels

        updated = product.model_copy(update=updates)
        self._products[product_id] = updated
        return updated


catalog_store = CatalogStore()
catalog_store.seed()
