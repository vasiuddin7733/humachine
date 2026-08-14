---
name: catalog-service
description: Develop and test the FastAPI catalog_service microservice in humachine. Use when adding product CRUD routes, catalog store logic, validation schemas, pytest tests, or Docker setup for services/catalog_service.
---

# Catalog Service

## Stack

- FastAPI + Pydantic + uvicorn
- In-memory `CatalogStore` for MVP
- pytest + httpx TestClient

## Run locally

```bash
cd services/catalog_service
source .venv/bin/activate
uvicorn app.main:app --reload --port 8002
pytest
```

Use quoted extras in zsh: `pip install -e '.[dev]'`

## Project structure

```text
app/
  main.py           FastAPI app and CORS
  config.py         Settings via pydantic-settings
  routers/          health, marketplaces, products
  schemas/          Pydantic models
  services/         catalog store and validation
tests/
  test_api.py
```

## Responsibilities

- product draft CRUD
- marketplace assignment on create
- channel state initialization (`draft` / `not_started`)
- product updates (title, category, price, marketplaces)

Do **not** put publish/promote logic here — that belongs in listing/promotion services or the gateway.

## Adding a route

1. Define or extend schema in `app/schemas/`
2. Add business logic in `app/services/catalog.py`
3. Create router handler in `app/routers/`
4. Register router in `app/main.py` with `settings.api_prefix`
5. Add pytest coverage in `tests/test_api.py`

## Docker

```bash
docker compose up --build catalog_service
```

Port mapping: host `8002` → container `8000`

## Docs

- Service README: `services/catalog_service/README.md`
- Setup guide: `services/catalog_service/docs/SETUP.md`
