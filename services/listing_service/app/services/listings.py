from __future__ import annotations

from dataclasses import dataclass, field
from itertools import count

from app.schemas.listing import Listing, ListingCreate, ListingStatus, Marketplace


@dataclass
class ListingStore:
    _id_sequence: count = field(default_factory=lambda: count(1))
    _listings: dict[int, Listing] = field(default_factory=dict)

    def seed(self) -> None:
        if self._listings:
            return

        seeded = [
            Listing(
                id=next(self._id_sequence),
                product_id=1,
                sku="SKU-ELEC-101",
                title="Noise Cancelling Headphones",
                marketplace=Marketplace.amazon,
                price=129.99,
                status=ListingStatus.ready,
            ),
            Listing(
                id=next(self._id_sequence),
                product_id=1,
                sku="SKU-ELEC-101",
                title="Noise Cancelling Headphones",
                marketplace=Marketplace.flipkart,
                price=129.99,
                status=ListingStatus.submitted,
                external_listing_id="FK-MOCK-1002",
            ),
            Listing(
                id=next(self._id_sequence),
                product_id=2,
                sku="SKU-HOME-102",
                title="Reusable Water Bottle",
                marketplace=Marketplace.meesho,
                price=24.50,
                status=ListingStatus.active,
                external_listing_id="MS-MOCK-1003",
            ),
        ]

        for listing in seeded:
            self._listings[listing.id] = listing

    def list_listings(self, marketplace: Marketplace | None = None) -> list[Listing]:
        listings = list(self._listings.values())
        if marketplace is None:
            return listings
        return [listing for listing in listings if listing.marketplace is marketplace]

    def get_listing(self, listing_id: int) -> Listing | None:
        return self._listings.get(listing_id)

    def create_listing(self, payload: ListingCreate) -> Listing:
        for listing in self._listings.values():
            if listing.product_id == payload.product_id and listing.marketplace is payload.marketplace:
                raise ValueError(
                    f"Listing already exists for product {payload.product_id} on {payload.marketplace.value}."
                )

        listing_id = next(self._id_sequence)
        listing = Listing(
            id=listing_id,
            product_id=payload.product_id,
            sku=payload.sku.strip(),
            title=payload.title.strip(),
            marketplace=payload.marketplace,
            price=payload.price,
            status=ListingStatus.draft,
        )
        self._listings[listing_id] = listing
        return listing

    def advance_listing(self, listing_id: int) -> Listing:
        listing = self.get_listing(listing_id)
        if listing is None:
            raise KeyError(f"Listing {listing_id} not found.")

        next_status = {
            ListingStatus.draft: ListingStatus.ready,
            ListingStatus.ready: ListingStatus.submitted,
            ListingStatus.submitted: ListingStatus.active,
            ListingStatus.active: ListingStatus.active,
        }[listing.status]

        updates: dict[str, object] = {"status": next_status, "last_error": None}

        if listing.status is ListingStatus.ready and next_status is ListingStatus.submitted:
            prefix = {
                Marketplace.amazon: "AMZ",
                Marketplace.flipkart: "FK",
                Marketplace.meesho: "MS",
            }[listing.marketplace]
            updates["external_listing_id"] = f"{prefix}-MOCK-{listing.id + 1000}"

        updated = listing.model_copy(update=updates)
        self._listings[listing_id] = updated
        return updated

    def get_status(self, listing_id: int) -> Listing:
        listing = self.get_listing(listing_id)
        if listing is None:
            raise KeyError(f"Listing {listing_id} not found.")
        return listing


listing_store = ListingStore()
listing_store.seed()
