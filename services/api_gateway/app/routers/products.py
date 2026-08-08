from fastapi import APIRouter, HTTPException, status

from app.schemas.product import (
    IngestionResult,
    Product,
    ProductCreate,
    PromoteRequest,
    PublishRequest,
)
from app.services.catalog import catalog_store
from app.agents import product_ingestion_agent

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[Product])
def list_products() -> list[Product]:
    return catalog_store.list_products()


@router.post("", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate) -> Product:
    return catalog_store.create_product(payload)


@router.post("/upload", response_model=IngestionResult, status_code=status.HTTP_201_CREATED)
def upload_product(payload: ProductCreate) -> IngestionResult:
    """Upload images/content, enqueue downstream work, and track service status."""
    try:
        return product_ingestion_agent.ingest(payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int) -> Product:
    product = catalog_store.get_product(product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    return product


@router.post("/{product_id}/publish", response_model=Product)
def publish_product(product_id: int, payload: PublishRequest) -> Product:
    try:
        return catalog_store.advance_listing(product_id, payload.marketplace)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.post("/{product_id}/promote", response_model=Product)
def promote_product(product_id: int, payload: PromoteRequest) -> Product:
    try:
        return catalog_store.advance_promotion(product_id, payload.marketplace)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
