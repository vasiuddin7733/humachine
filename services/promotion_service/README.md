# Promotion Service

Marketplace promotion microservice for launching campaigns on Amazon, Flipkart, and Meesho.

## Responsibilities

- create campaign drafts for an active listing
- advance promotion status: `not_started → scheduled → live`
- assign mock external campaign IDs when scheduled
- expose campaign status for gateway/frontend polling

## Run locally

From `services/promotion_service/`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --reload --port 8004
pytest
```

## Docker

From repository root:

```bash
docker compose up --build promotion_service
```

API docs: `http://127.0.0.1:8004/docs`

Host and container both use port `8004`.

## Skills

- Campaign creation after listing activation
- Promotion launch transitions
- Mock marketplace ad campaign IDs
- Status retrieval for polling clients

## Documentation

- `docs/SETUP.md` — install, env vars, curl examples
- `../../docs/ARCHITECTURE.md` — system architecture

## Routes

- `GET /health`
- `GET /api/v1/marketplaces`
- `GET /api/v1/campaigns`
- `POST /api/v1/campaigns`
- `GET /api/v1/campaigns/{campaign_id}`
- `GET /api/v1/campaigns/{campaign_id}/status`
- `POST /api/v1/campaigns/{campaign_id}/launch`
