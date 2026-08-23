from enum import Enum

from pydantic import BaseModel, Field


class Marketplace(str, Enum):
    amazon = "amazon"
    flipkart = "flipkart"
    meesho = "meesho"


class PromotionStatus(str, Enum):
    not_started = "not_started"
    scheduled = "scheduled"
    live = "live"


class CampaignCreate(BaseModel):
    product_id: int = Field(gt=0)
    listing_id: int = Field(gt=0)
    sku: str = Field(min_length=2, max_length=80)
    title: str = Field(min_length=2, max_length=200)
    marketplace: Marketplace
    daily_budget: float = Field(default=20.0, gt=0)
    listing_is_active: bool = True


class Campaign(BaseModel):
    id: int
    product_id: int
    listing_id: int
    sku: str
    title: str
    marketplace: Marketplace
    daily_budget: float
    status: PromotionStatus
    external_campaign_id: str | None = None
    last_error: str | None = None
