# Listing Service

Marketplace listing microservice for publishing products to Amazon, Flipkart, and Meesho.

## Responsibilities

- create listing records per product + marketplace
- advance listing status: `draft → ready → submitted → active`
- assign mock external listing IDs on submit
- expose listing status for gateway/frontend polling

## Run locally

From `services/listing_service/`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --reload --port 8003
pytest
```

## Docker

From repository root:

```bash
docker compose up --build listing_service
```

API docs: `http://127.0.0.1:8003/docs`

Host and container both use port `8003`.

## Skills

- Per-marketplace listing creation
- Listing readiness and publish transitions
- Mock channel publish with external listing IDs
- Status retrieval for polling clients

## Documentation

- `docs/SETUP.md` — install, env vars, curl examples
- `../../docs/ARCHITECTURE.md` — system architecture

## Routes

- `GET /health`
- `GET /api/v1/marketplaces`
- `GET /api/v1/listings`
- `POST /api/v1/listings`
- `GET /api/v1/listings/{listing_id}`
- `GET /api/v1/listings/{listing_id}/status`
- `POST /api/v1/listings/{listing_id}/publish`
