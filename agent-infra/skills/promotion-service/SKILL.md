---
name: promotion-service
description: Develop and test the FastAPI promotion_service microservice in humachine. Use when adding campaign routes, promotion status transitions, Amazon/Flipkart/Meesho ad mocks, pytest tests, or Docker setup for services/promotion_service.
---

# Promotion Service

## Stack

- FastAPI + Pydantic + uvicorn
- In-memory `CampaignStore` for MVP
- pytest + httpx TestClient

## Run locally

```bash
cd services/promotion_service
source .venv/bin/activate
uvicorn app.main:app --reload --port 8004
pytest
```

Use quoted extras in zsh: `pip install -e '.[dev]'`

## Project structure

```text
app/
  main.py           FastAPI app and CORS
  config.py         Settings via pydantic-settings
  routers/          health, marketplaces, campaigns
  schemas/          Campaign models
  services/         campaign store and launch transitions
tests/
  test_api.py
```

## Responsibilities

- create campaign drafts for active listings
- advance status: `not_started → scheduled → live`
- assign mock external campaign IDs when scheduled
- expose status endpoints for gateway polling

Do **not** put product CRUD here — that belongs in `catalog_service`.
Do **not** put listing publish logic here — that belongs in `listing_service`.

## Validation rules

- `listing_is_active` must be `true` to create a campaign
- one campaign per listing + marketplace pair

## Adding a route

1. Define or extend schema in `app/schemas/`
2. Add business logic in `app/services/campaigns.py`
3. Create router handler in `app/routers/`
4. Register router in `app/main.py` with `settings.api_prefix`
5. Add pytest coverage in `tests/test_api.py`

## Docker

```bash
docker compose up --build promotion_service
```

Port mapping: host `8004` → container `8004`

## Docs

- Service README: `services/promotion_service/README.md`
- Setup guide: `services/promotion_service/docs/SETUP.md`
