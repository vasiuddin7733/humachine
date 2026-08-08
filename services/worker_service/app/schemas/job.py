from datetime import datetime
from enum import Enum

from pydantic import BaseModel, Field


class Marketplace(str, Enum):
    amazon = "amazon"
    flipkart = "flipkart"
    meesho = "meesho"


class JobType(str, Enum):
    sync_listing = "sync_listing"
    sync_promotion = "sync_promotion"
    publish_retry = "publish_retry"
    inventory_sync = "inventory_sync"


class JobStatus(str, Enum):
    queued = "queued"
    running = "running"
    completed = "completed"
    failed = "failed"


class JobCreate(BaseModel):
    job_type: JobType
    product_id: int = Field(gt=0)
    listing_id: int | None = Field(default=None, gt=0)
    campaign_id: int | None = Field(default=None, gt=0)
    marketplace: Marketplace
    sku: str = Field(min_length=2, max_length=80)
    max_attempts: int = Field(default=3, ge=1, le=10)


class Job(BaseModel):
    id: int
    job_type: JobType
    product_id: int
    listing_id: int | None = None
    campaign_id: int | None = None
    marketplace: Marketplace
    sku: str
    status: JobStatus
    attempts: int = 0
    max_attempts: int = 3
    last_error: str | None = None
    result_summary: str | None = None
    created_at: datetime
    updated_at: datetime
