---
name: api-gateway-service
description: Develop and test the FastAPI api_gateway service in humachine. Use when adding routes, Pydantic schemas, catalog store logic, pytest tests, CORS config, or running uvicorn for services/api_gateway.
---

# API Gateway Service

## Stack

- FastAPI + Pydantic + uvicorn
- In-memory `CatalogStore` for MVP
- pytest + httpx TestClient

## Run locally

```bash
cd services/api_gateway
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
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
  services/         catalog store and business logic
tests/
  test_api.py
```

## Adding a route

1. Define or extend schema in `app/schemas/`
2. Add business logic in `app/services/`
3. Create router handler in `app/routers/`
4. Register router in `app/main.py` with `settings.api_prefix`
5. Add pytest coverage in `tests/test_api.py`

## Conventions

- Use `HTTPException` for 404/400 errors
- Keep routers thin; put state transitions in services
- Prefix frontend routes with `/api/v1`
- Allow CORS for Vite dev server origins in `config.py`

## Docs

- Service README: `services/api_gateway/README.md`
- Setup guide: `services/api_gateway/docs/SETUP.md`
