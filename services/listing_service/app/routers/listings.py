from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.listing import Listing, ListingCreate, Marketplace
from app.services.listings import listing_store

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("", response_model=list[Listing])
def list_listings(
    marketplace: Marketplace | None = Query(default=None),
) -> list[Listing]:
    return listing_store.list_listings(marketplace)


@router.post("", response_model=Listing, status_code=status.HTTP_201_CREATED)
def create_listing(payload: ListingCreate) -> Listing:
    try:
        return listing_store.create_listing(payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/{listing_id}", response_model=Listing)
def get_listing(listing_id: int) -> Listing:
    listing = listing_store.get_listing(listing_id)
    if listing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found.")
    return listing


@router.get("/{listing_id}/status", response_model=Listing)
def get_listing_status(listing_id: int) -> Listing:
    try:
        return listing_store.get_status(listing_id)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.post("/{listing_id}/publish", response_model=Listing)
def publish_listing(listing_id: int) -> Listing:
    try:
        return listing_store.advance_listing(listing_id)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
