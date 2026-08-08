# API Gateway

This service is the backend entrypoint for the ecommerce control center frontend.

## Responsibilities

- expose frontend-facing API routes
- manage product draft data
- track listing status by marketplace
- trigger mock publish and promotion actions
- queue-backed product ingestion agent with per-service status tracking

## Run locally

From `services/api_gateway/`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --reload --port 8001
```

## Skills

- Product draft creation with marketplace selection
- Per-channel listing transitions (`draft → ready → submitted → active`)
- Promotion guardrails (requires active listing)
- Product ingestion agent (`POST /api/v1/products/upload`)
- Ingestion status polling (`GET /api/v1/ingestions/{id}`)

## Documentation

- `docs/SETUP.md` — install, env vars, curl examples
- `../../docs/ARCHITECTURE.md` — full system architecture
- `.env.example` — compose/service environment template

## Routes

- `GET /health`
- `GET /api/v1/marketplaces`
- `GET /api/v1/products`
- `POST /api/v1/products`
- `POST /api/v1/products/upload`
- `GET /api/v1/products/{product_id}`
- `POST /api/v1/products/{product_id}/publish`
- `POST /api/v1/products/{product_id}/promote`
- `GET /api/v1/ingestions`
- `GET /api/v1/ingestions/{run_id}`
