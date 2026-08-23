from fastapi import APIRouter, HTTPException, Query, status

from app.schemas.campaign import Campaign, CampaignCreate, Marketplace
from app.services.campaigns import campaign_store

router = APIRouter(prefix="/campaigns", tags=["campaigns"])


@router.get("", response_model=list[Campaign])
def list_campaigns(
    marketplace: Marketplace | None = Query(default=None),
) -> list[Campaign]:
    return campaign_store.list_campaigns(marketplace)


@router.post("", response_model=Campaign, status_code=status.HTTP_201_CREATED)
def create_campaign(payload: CampaignCreate) -> Campaign:
    try:
        return campaign_store.create_campaign(payload)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc


@router.get("/{campaign_id}", response_model=Campaign)
def get_campaign(campaign_id: int) -> Campaign:
    campaign = campaign_store.get_campaign(campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found.")
    return campaign


@router.get("/{campaign_id}/status", response_model=Campaign)
def get_campaign_status(campaign_id: int) -> Campaign:
    try:
        return campaign_store.get_status(campaign_id)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc


@router.post("/{campaign_id}/launch", response_model=Campaign)
def launch_campaign(campaign_id: int) -> Campaign:
    try:
        return campaign_store.advance_campaign(campaign_id)
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
