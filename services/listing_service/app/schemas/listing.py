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


class ListingCreate(BaseModel):
    product_id: int = Field(gt=0)
    sku: str = Field(min_length=2, max_length=80)
    title: str = Field(min_length=2, max_length=200)
    marketplace: Marketplace
    price: float = Field(gt=0)


class PublishRequest(BaseModel):
    marketplace: Marketplace | None = None


class Listing(BaseModel):
    id: int
    product_id: int
    sku: str
    title: str
    marketplace: Marketplace
    price: float
    status: ListingStatus
    external_listing_id: str | None = None
    last_error: str | None = None
