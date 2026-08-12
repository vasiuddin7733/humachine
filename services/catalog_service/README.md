# Catalog Service

Product catalog microservice for the humachine ecommerce ecommerce platform.

## Responsibilities

- store product drafts and core attributes
- validate title, category, price, and marketplace selection
- initialize per-channel listing and promotion state
- expose CRUD APIs for the API gateway and frontend

## Run locally

From `services/catalog_service/`:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --reload --port 8002
pytest
```

## Docker

From repository root:

```bash
docker compose up --build catalog_service
```

API docs: `http://127.0.0.1:8002/docs`

## Skills

- Product draft creation and validation
- Marketplace assignment on create
- Product updates with channel initialization
- Pydantic schemas shared with gateway patterns

## Documentation

- `docs/SETUP.md` — install, env vars, curl examples
- `../../docs/ARCHITECTURE.md` — system architecture

## Routes

- `GET /health`
- `GET /api/v1/marketplaces`
- `GET /api/v1/products`
- `POST /api/v1/products`
- `GET /api/v1/products/{product_id}`
- `PUT /api/v1/products/{product_id}`
