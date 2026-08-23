from __future__ import annotations

from dataclasses import dataclass, field
from datetime import UTC, datetime
from itertools import count

from app.schemas.job import Job, JobCreate, JobStatus, JobType, Marketplace


def _utcnow() -> datetime:
    return datetime.now(UTC)


@dataclass
class JobStore:
    _id_sequence: count = field(default_factory=lambda: count(1))
    _jobs: dict[int, Job] = field(default_factory=dict)

    def seed(self) -> None:
        if self._jobs:
            return

        now = _utcnow()
        seeded = [
            Job(
                id=next(self._id_sequence),
                job_type=JobType.sync_listing,
                product_id=2,
                listing_id=3,
                marketplace=Marketplace.flipkart,
                sku="SKU-HOME-102",
                status=JobStatus.completed,
                attempts=1,
                max_attempts=3,
                result_summary="Listing status synced: active",
                created_at=now,
                updated_at=now,
            ),
            Job(
                id=next(self._id_sequence),
                job_type=JobType.sync_promotion,
                product_id=2,
                listing_id=3,
                campaign_id=1,
                marketplace=Marketplace.amazon,
                sku="SKU-HOME-102",
                status=JobStatus.queued,
                attempts=0,
                max_attempts=3,
                created_at=now,
                updated_at=now,
            ),
        ]

        for job in seeded:
            self._jobs[job.id] = job

    def list_jobs(
        self,
        job_type: JobType | None = None,
        status: JobStatus | None = None,
    ) -> list[Job]:
        jobs = list(self._jobs.values())
        if job_type is not None:
            jobs = [job for job in jobs if job.job_type is job_type]
        if status is not None:
            jobs = [job for job in jobs if job.status is status]
        return jobs

    def get_job(self, job_id: int) -> Job | None:
        return self._jobs.get(job_id)

    def enqueue_job(self, payload: JobCreate) -> Job:
        if payload.job_type is JobType.sync_promotion and payload.campaign_id is None:
            raise ValueError("campaign_id is required for sync_promotion jobs.")
        if payload.job_type is JobType.publish_retry and payload.listing_id is None:
            raise ValueError("listing_id is required for publish_retry jobs.")

        job_id = next(self._id_sequence)
        now = _utcnow()
        job = Job(
            id=job_id,
            job_type=payload.job_type,
            product_id=payload.product_id,
            listing_id=payload.listing_id,
            campaign_id=payload.campaign_id,
            marketplace=payload.marketplace,
            sku=payload.sku.strip(),
            status=JobStatus.queued,
            attempts=0,
            max_attempts=payload.max_attempts,
            created_at=now,
            updated_at=now,
        )
        self._jobs[job_id] = job
        return job

    def run_job(self, job_id: int) -> Job:
        job = self.get_job(job_id)
        if job is None:
            raise KeyError(f"Job {job_id} not found.")

        if job.status is JobStatus.completed:
            return job

        if job.status is JobStatus.failed and job.attempts >= job.max_attempts:
            raise ValueError(f"Job {job_id} exceeded max attempts ({job.max_attempts}).")

        attempts = job.attempts + 1
        updates: dict[str, object] = {
            "attempts": attempts,
            "updated_at": _utcnow(),
            "last_error": None,
        }

        if job.status is JobStatus.queued:
            updates["status"] = JobStatus.running
        elif job.status is JobStatus.running:
            updates["status"] = JobStatus.completed
            updates["result_summary"] = self._mock_result(job)
        elif job.status is JobStatus.failed:
            updates["status"] = JobStatus.running

        updated = job.model_copy(update=updates)
        self._jobs[job_id] = updated
        return updated

    def retry_job(self, job_id: int) -> Job:
        job = self.get_job(job_id)
        if job is None:
            raise KeyError(f"Job {job_id} not found.")

        if job.status is not JobStatus.failed:
            raise ValueError("Only failed jobs can be retried.")

        if job.attempts >= job.max_attempts:
            raise ValueError(f"Job {job_id} exceeded max attempts ({job.max_attempts}).")

        updated = job.model_copy(
            update={
                "status": JobStatus.queued,
                "last_error": None,
                "updated_at": _utcnow(),
            }
        )
        self._jobs[job_id] = updated
        return updated

    def fail_job(self, job_id: int, error: str) -> Job:
        job = self.get_job(job_id)
        if job is None:
            raise KeyError(f"Job {job_id} not found.")

        updated = job.model_copy(
            update={
                "status": JobStatus.failed,
                "last_error": error,
                "updated_at": _utcnow(),
            }
        )
        self._jobs[job_id] = updated
        return updated

    def get_status(self, job_id: int) -> Job:
        job = self.get_job(job_id)
        if job is None:
            raise KeyError(f"Job {job_id} not found.")
        return job

    def _mock_result(self, job: Job) -> str:
        summaries = {
            JobType.sync_listing: f"Listing {job.listing_id} synced on {job.marketplace.value}",
            JobType.sync_promotion: f"Campaign {job.campaign_id} synced on {job.marketplace.value}",
            JobType.publish_retry: f"Publish retry succeeded for listing {job.listing_id}",
            JobType.inventory_sync: f"Inventory synced for SKU {job.sku}",
        }
        return summaries[job.job_type]


job_store = JobStore()
job_store.seed()
