---
name: api-gateway-service
description: Develop and test the FastAPI api_gateway service in humachine ecommerce. Use when adding routes, Pydantic schemas, catalog store logic, pytest tests, CORS config, or running uvicorn for services/api_gateway.
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
uvicorn app.main:app --reload --port 8001
pytest
```

Use quoted extras in zsh: `pip install -e '.[dev]'`

## Project structure

```text
app/
  agents/
    ingestion_agent.py   Agent 1 — upload + enqueue
    dispatch_agent.py    Agent 2 — queue consumer + HTTP fan-out
  services/
    message_queue.py     memory or Redis queue
    status_tracker.py    per-service ingestion status
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
- Allow CORS for Vite/frontend origins in `config.py`
- Ingestion agent: `app/agents/ingestion_agent.py`
- Dispatch agent: `app/agents/dispatch_agent.py`
- Queue: `app/services/message_queue.py` (`memory` or `redis`)
- Status: `app/services/status_tracker.py`
- Service URLs come from `API_GATEWAY_*_SERVICE_URL` env vars

## Docs

- Service README: `services/api_gateway/README.md`
- Setup guide: `services/api_gateway/docs/SETUP.md`
- Ingestion skill: `.cursor/skills/product-ingestion-agent/SKILL.md`
- Dispatch skill: `.cursor/skills/dispatch-agent/SKILL.md`
