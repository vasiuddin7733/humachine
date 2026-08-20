# API Gateway

This service is the backend entrypoint for the ecommerce control center frontend.

## Responsibilities

- expose frontend-facing API routes
- manage product draft data
- track listing status by marketplace
- trigger mock publish and promotion actions
- prepare a clean surface for future Python microservices

## Run locally

From `services/api_gateway/`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[dev]
uvicorn app.main:app --reload --port 8000
```

## Initial routes

- `GET /health`
- `GET /api/v1/marketplaces`
- `GET /api/v1/products`
- `POST /api/v1/products`
- `GET /api/v1/products/{product_id}`
- `POST /api/v1/products/{product_id}/publish`
- `POST /api/v1/products/{product_id}/promote`
