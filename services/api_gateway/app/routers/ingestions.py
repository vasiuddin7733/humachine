from fastapi import APIRouter, HTTPException, status

from app.schemas.product import IngestionRun
from app.services.status_tracker import status_tracker

router = APIRouter(prefix="/ingestions", tags=["ingestions"])


@router.get("", response_model=list[IngestionRun])
def list_ingestions() -> list[IngestionRun]:
    return status_tracker.list_runs()


@router.get("/{run_id}", response_model=IngestionRun)
def get_ingestion(run_id: int) -> IngestionRun:
    run = status_tracker.get_run(run_id)
    if run is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ingestion run not found.")
    return run
