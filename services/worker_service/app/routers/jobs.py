from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.job import Job, JobCreate, JobStatus, JobType
from app.services.jobs import job_store

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("", response_model=list[Job])
def list_jobs(
    job_type: JobType | None = Query(default=None),
    status: JobStatus | None = Query(default=None),
) -> list[Job]:
    return job_store.list_jobs(job_type, status)


@router.post("", response_model=Job, status_code=status.HTTP_201_CREATED)
def enqueue_job(payload: JobCreate) -> Job:
    try:
        return job_store.enqueue_job(payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/{job_id}", response_model=Job)
def get_job(job_id: int) -> Job:
    job = job_store.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")
    return job


@router.get("/{job_id}/status", response_model=Job)
def get_job_status(job_id: int) -> Job:
    try:
        return job_store.get_status(job_id)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.post("/{job_id}/run", response_model=Job)
def run_job(job_id: int) -> Job:
    try:
        return job_store.run_job(job_id)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/{job_id}/retry", response_model=Job)
def retry_job(job_id: int) -> Job:
    try:
        return job_store.retry_job(job_id)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
