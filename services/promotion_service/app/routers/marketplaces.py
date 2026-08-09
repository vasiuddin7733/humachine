from fastapi import APIRouter

from app.schemas.campaign import Marketplace

router = APIRouter(prefix="/marketplaces", tags=["marketplaces"])


@router.get("", response_model=list[Marketplace])
def list_marketplaces() -> list[Marketplace]:
    return list(Marketplace)
