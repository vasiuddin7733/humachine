from fastapi import APIRouter, HTTPException, status

from app.schemas.product import Product, ProductCreate, ProductUpdate
from app.services.catalog import catalog_store

router = APIRouter(prefix="/products", tags=["products"])


@router.get("", response_model=list[Product])
def list_products() -> list[Product]:
    return catalog_store.list_products()


@router.post("", response_model=Product, status_code=status.HTTP_201_CREATED)
def create_product(payload: ProductCreate) -> Product:
    return catalog_store.create_product(payload)


@router.get("/{product_id}", response_model=Product)
def get_product(product_id: int) -> Product:
    product = catalog_store.get_product(product_id)
    if product is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found.")
    return product


@router.put("/{product_id}", response_model=Product)
def update_product(product_id: int, payload: ProductUpdate) -> Product:
    try:
        return catalog_store.update_product(product_id, payload)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
