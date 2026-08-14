# Catalog Service Setup

## Prerequisites

- Python 3.11+
- `pip` and `venv`

## Install

```bash
cd services/catalog_service
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
```

## Run

```bash
uvicorn app.main:app --reload --port 8002
```

## Test

```bash
pytest
```

## Docker

From repository root:

```bash
docker compose up --build catalog_service
```

From `services/catalog_service/`:

```bash
docker build -t humachine-catalog-service .
docker run --rm -p 8002:800 humachine-catalog-service
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `CATALOG_SERVICE_APP_NAME` | Humachine Catalog Service | Service title |
| `CATALOG_SERVICE_API_PREFIX` | `/api/v1` | API route prefix |
| `CATALOG_SERVICE_ENVIRONMENT` | `development` | Runtime environment |
| `CATALOG_SERVICE_ALLOWED_ORIGINS` | frontend/gateway URLs | CORS origins |

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| GET | `/api/v1/marketplaces` | List supported marketplaces |
| GET | `/api/v1/products` | List products |
| POST | `/api/v1/products` | Create product draft |
| GET | `/api/v1/products/{id}` | Get product by id |
| PUT | `/api/v1/products/{id}` | Update product draft |

## Example requests

Create product:

```bash
curl -X POST http://127.0.0.1:8002/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Desk Lamp",
    "category": "Home",
    "price": 39.99,
    "marketplaces": ["amazon", "flipkart"]
  }'
```

Update product:

```bash
curl -X PUT http://127.0.0.1:8002/api/v1/products/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 44.99}'
```
