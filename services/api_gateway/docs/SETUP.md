# API Gateway Setup

## Prerequisites

- Python 3.11+
- `pip` and `venv`

## Install

```bash
cd services/api_gateway
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
```

## Run

```bash
uvicorn app.main:app --reload --port 8001
```

## Docker

From repository root:

```bash
docker compose up --build api_gateway
```

Or from `services/api_gateway/`:

```bash
docker build -t humachine-api-gateway .
docker run --rm -p 8001:8001 humachine-api-gateway
```

API docs: `http://127.0.0.1:8001/docs`

## Test

```bash
pytest
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `API_GATEWAY_APP_NAME` | Humachine API Gateway | Service title |
| `API_GATEWAY_API_PREFIX` | `/api/v1` | API route prefix |
| `API_GATEWAY_ENVIRONMENT` | `development` | Runtime environment |
| `API_GATEWAY_ALLOWED_ORIGINS` | localhost Vite URLs | CORS origins |

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| GET | `/api/v1/marketplaces` | List supported marketplaces |
| GET | `/api/v1/products` | List products |
| POST | `/api/v1/products` | Create product draft |
| GET | `/api/v1/products/{id}` | Get product by id |
| POST | `/api/v1/products/{id}/publish` | Advance listing status |
| POST | `/api/v1/products/{id}/promote` | Advance promotion status |

## Skills implemented

- Product draft creation with marketplace selection
- Per-channel listing state transitions
- Promotion guardrails (listing must be active first)
- Frontend-ready JSON schemas with Pydantic

## Example requests

Create product:

```bash
curl -X POST http://127.0.0.1:8001/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Desk Lamp",
    "category": "Home",
    "price": 39.99,
    "marketplaces": ["amazon", "flipkart"]
  }'
```

Publish to Flipkart:

```bash
curl -X POST http://127.0.0.1:8001/api/v1/products/1/publish \
  -H "Content-Type: application/json" \
  -d '{"marketplace": "flipkart"}'
```
