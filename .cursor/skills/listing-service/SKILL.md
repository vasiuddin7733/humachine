---
name: listing-service
description: Develop and test the FastAPI listing_service microservice in humachine. Use when adding marketplace publish routes, listing status transitions, Amazon/Flipkart/Meesho listing mocks, pytest tests, or Docker setup for services/listing_service.
---

# Listing Service

## Stack

- FastAPI + Pydantic + uvicorn
- In-memory `ListingStore` for MVP
- pytest + httpx TestClient

## Run locally

```bash
cd services/listing_service
source .venv/bin/activate
uvicorn app.main:app --reload --port 8003
pytest
```

Use quoted extras in zsh: `pip install -e '.[dev]'`

## Project structure

```text
app/
  main.py           FastAPI app and CORS
  config.py         Settings via pydantic-settings
  routers/          health, marketplaces, listings
  schemas/          Listing models
  services/         listing store and publish transitions
tests/
  test_api.py
```

## Responsibilities

- create listing drafts for product + marketplace
- advance status: `draft → ready → submitted → active`
- assign mock external listing IDs when submitted
- expose status endpoints for gateway polling

Do **not** put product CRUD here — that belongs in `catalog_service`.
Do **not** put promotion logic here — that belongs in `promotion_service`.

## Adding a route

1. Define or extend schema in `app/schemas/`
2. Add business logic in `app/services/listings.py`
3. Create router handler in `app/routers/`
4. Register router in `app/main.py` with `settings.api_prefix`
5. Add pytest coverage in `tests/test_api.py`

## Docker

```bash
docker compose up --build listing_service
```

Port mapping: host `8003` → container `8003`

## Docs

- Service README: `services/listing_service/README.md`
- Setup guide: `services/listing_service/docs/SETUP.md`
