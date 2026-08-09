from __future__ import annotations

from dataclasses import dataclass, field
from itertools import count

from app.schemas.campaign import Campaign, CampaignCreate, Marketplace, PromotionStatus


@dataclass
class CampaignStore:
    _id_sequence: count = field(default_factory=lambda: count(1))
    _campaigns: dict[int, Campaign] = field(default_factory=dict)

    def seed(self) -> None:
        if self._campaigns:
            return

        seeded = [
            Campaign(
                id=next(self._id_sequence),
                product_id=2,
                listing_id=3,
                sku="SKU-HOME-102",
                title="Reusable Water Bottle",
                marketplace=Marketplace.flipkart,
                daily_budget=25.0,
                status=PromotionStatus.live,
                external_campaign_id="FK-ADS-1001",
            ),
            Campaign(
                id=next(self._id_sequence),
                product_id=2,
                listing_id=3,
                sku="SKU-HOME-102",
                title="Reusable Water Bottle",
                marketplace=Marketplace.amazon,
                daily_budget=30.0,
                status=PromotionStatus.scheduled,
                external_campaign_id="AMZ-ADS-1002",
            ),
        ]

        for campaign in seeded:
            self._campaigns[campaign.id] = campaign

    def list_campaigns(self, marketplace: Marketplace | None = None) -> list[Campaign]:
        campaigns = list(self._campaigns.values())
        if marketplace is None:
            return campaigns
        return [campaign for campaign in campaigns if campaign.marketplace is marketplace]

    def get_campaign(self, campaign_id: int) -> Campaign | None:
        return self._campaigns.get(campaign_id)

    def create_campaign(self, payload: CampaignCreate) -> Campaign:
        if not payload.listing_is_active:
            raise ValueError("Listing must be active before a promotion can start.")

        for campaign in self._campaigns.values():
            if (
                campaign.listing_id == payload.listing_id
                and campaign.marketplace is payload.marketplace
            ):
                raise ValueError(
                    f"Campaign already exists for listing {payload.listing_id} on {payload.marketplace.value}."
                )

        campaign_id = next(self._id_sequence)
        campaign = Campaign(
            id=campaign_id,
            product_id=payload.product_id,
            listing_id=payload.listing_id,
            sku=payload.sku.strip(),
            title=payload.title.strip(),
            marketplace=payload.marketplace,
            daily_budget=payload.daily_budget,
            status=PromotionStatus.not_started,
        )
        self._campaigns[campaign_id] = campaign
        return campaign

    def advance_campaign(self, campaign_id: int) -> Campaign:
        campaign = self.get_campaign(campaign_id)
        if campaign is None:
            raise KeyError(f"Campaign {campaign_id} not found.")

        next_status = {
            PromotionStatus.not_started: PromotionStatus.scheduled,
            PromotionStatus.scheduled: PromotionStatus.live,
            PromotionStatus.live: PromotionStatus.live,
        }[campaign.status]

        updates: dict[str, object] = {"status": next_status, "last_error": None}

        if campaign.status is PromotionStatus.not_started and next_status is PromotionStatus.scheduled:
            prefix = {
                Marketplace.amazon: "AMZ-ADS",
                Marketplace.flipkart: "FK-ADS",
                Marketplace.meesho: "MS-ADS",
            }[campaign.marketplace]
            updates["external_campaign_id"] = f"{prefix}-{campaign.id + 1000}"

        updated = campaign.model_copy(update=updates)
        self._campaigns[campaign_id] = updated
        return updated

    def get_status(self, campaign_id: int) -> Campaign:
        campaign = self.get_campaign(campaign_id)
        if campaign is None:
            raise KeyError(f"Campaign {campaign_id} not found.")
        return campaign


campaign_store = CampaignStore()
campaign_store.seed()
