from fastapi import APIRouter

from app.schemas.product import Marketplace

router = APIRouter(prefix="/marketplaces", tags=["marketplaces"])


@router.get("", response_model=list[Marketplace])
def list_marketplaces() -> list[Marketplace]:
    return list(Marketplace)
services/api_gateway/
