from enum import Enum

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


class ChannelState(BaseModel):
    listing_status: ListingStatus = ListingStatus.draft
    promotion_status: PromotionStatus = PromotionStatus.not_started


class ProductCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    category: str = Field(min_length=2, max_length=120)
    price: float = Field(gt=0)
    marketplaces: list[Marketplace] = Field(min_length=1)


class ProductUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=200)
    category: str | None = Field(default=None, min_length=2, max_length=120)
    price: float | None = Field(default=None, gt=0)
    marketplaces: list[Marketplace] | None = Field(default=None, min_length=1)


class Product(BaseModel):
    id: int
    sku: str
    title: str
    category: str
    price: float
    marketplaces: list[Marketplace]
    channels: dict[Marketplace, ChannelState]
