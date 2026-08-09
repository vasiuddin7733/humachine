---
name: worker-service
description: Develop and test the FastAPI worker_service microservice in humachine. Use when adding background job routes, sync/retry job types, scheduled task mocks, pytest tests, or Docker setup for services/worker_service.
---

# Worker Service

## Stack

- FastAPI + Pydantic + uvicorn
- In-memory `JobStore` for MVP
- pytest + httpx TestClient
- Future: Celery + Redis for real workers

## Run locally

```bash
cd services/worker_service
source .venv/bin/activate
uvicorn app.main:app --reload --port 8005
pytest
```

Use quoted extras in zsh: `pip install -e '.[dev]'`

## Project structure

```text
app/
  main.py           FastAPI app and CORS
  config.py         Settings via pydantic-settings
  routers/          health, marketplaces, jobs
  schemas/          Job models
  services/         job store and execution transitions
tests/
  test_api.py
```

## Responsibilities

- enqueue sync, retry, and inventory jobs
- advance status: `queued → running → completed`
- retry failed jobs within max attempt limits
- expose job status for gateway and operator polling

Do **not** put product CRUD here — that belongs in `catalog_service`.
Do **not** put listing publish logic here — that belongs in `listing_service`.
Do **not** put campaign creation here — that belongs in `promotion_service`.

## Job types

| Type | Required fields |
|------|-----------------|
| `sync_listing` | `listing_id` |
| `sync_promotion` | `campaign_id` |
| `publish_retry` | `listing_id` |
| `inventory_sync` | `sku`, `product_id` |

## Adding a route

1. Define or extend schema in `app/schemas/`
2. Add business logic in `app/services/jobs.py`
3. Create router handler in `app/routers/`
4. Register router in `app/main.py` with `settings.api_prefix`
5. Add pytest coverage in `tests/test_api.py`

## Docker

```bash
docker compose up --build worker_service
```

Port mapping: host `8005` → container `8005`

## Docs

- Service README: `services/worker_service/README.md`
- Setup guide: `services/worker_service/docs/SETUP.md`
