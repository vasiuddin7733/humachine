from enum import Enum

from datetime import datetime

from pydantic import BaseModel, Field


class Marketplace(str, Enum):
    amazon = "amazon"
    flipkart = "flipkart"
    meesho = "meesho"


class ListingStatus(str, Enum):
    draft = "draft"
    ready = "ready"
    submitted = "submitted"
    active = "active"


class PromotionStatus(str, Enum):
    not_started = "not_started"
    scheduled = "scheduled"
    live = "live"


class IngestionStatus(str, Enum):
    queued = "queued"
    running = "running"
    completed = "completed"
    failed = "failed"


class ChannelState(BaseModel):
    listing_status: ListingStatus = ListingStatus.draft
    promotion_status: PromotionStatus = PromotionStatus.not_started


class ProductCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    category: str = Field(min_length=2, max_length=120)
    price: float = Field(gt=0)
    marketplaces: list[Marketplace] = Field(min_length=1)
    description: str = Field(default="", max_length=4000)
    image_urls: list[str] = Field(default_factory=list, max_length=20)
    daily_budget: float = Field(default=20.0, gt=0)
    auto_activate_listings: bool = True


class Product(BaseModel):
    id: int
    sku: str
    title: str
    category: str
    price: float
    marketplaces: list[Marketplace]
    channels: dict[Marketplace, ChannelState]
    description: str = ""
    image_urls: list[str] = Field(default_factory=list)


class PublishRequest(BaseModel):
    marketplace: Marketplace


class PromoteRequest(BaseModel):
    marketplace: Marketplace


class IngestionStep(BaseModel):
    service: str
    status: IngestionStatus
    detail: str
    payload: dict | None = None
    updated_at: datetime


class IngestionRun(BaseModel):
    id: int
    product_id: int
    status: IngestionStatus
    steps: list[IngestionStep]
    created_at: datetime
    updated_at: datetime


class IngestionResult(BaseModel):
    product: Product
    run: IngestionRun
