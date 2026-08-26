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
| `API_GATEWAY_APP_NAME` | humachine ecommerce API Gateway | Service title |
| `API_GATEWAY_API_PREFIX` | `/api/v1` | API route prefix |
| `API_GATEWAY_ENVIRONMENT` | `development` | Runtime environment |
| `API_GATEWAY_PORT` | `8001` | Service port |
| `API_GATEWAY_ALLOWED_ORIGINS` | frontend URLs | CORS origins |
| `API_GATEWAY_CATALOG_SERVICE_URL` | `http://127.0.0.1:8002` | Catalog base URL |
| `API_GATEWAY_LISTING_SERVICE_URL` | `http://127.0.0.1:8003` | Listing base URL |
| `API_GATEWAY_PROMOTION_SERVICE_URL` | `http://127.0.0.1:8004` | Promotion base URL |
| `API_GATEWAY_WORKER_SERVICE_URL` | `http://127.0.0.1:8005` | Worker base URL |
| `API_GATEWAY_ORCHESTRATION_ENABLED` | `true` | Enable downstream fan-out |
| `API_GATEWAY_QUEUE_BACKEND` | `memory` | `memory` or `redis` |
| `API_GATEWAY_REDIS_URL` | `redis://127.0.0.1:6379/0` | Message queue broker |
| `API_GATEWAY_QUEUE_NAME` | `humachine.ingestion` | Queue name |
| `API_GATEWAY_HTTP_TIMEOUT_SECONDS` | `10` | Downstream HTTP timeout |

Repo template: [`.env.example`](../../../.env.example)

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| GET | `/api/v1/marketplaces` | List supported marketplaces |
| GET | `/api/v1/products` | List products |
| POST | `/api/v1/products` | Create product draft (local only) |
| POST | `/api/v1/products/upload` | Upload images/content + queue fan-out |
| GET | `/api/v1/products/{id}` | Get product by id |
| POST | `/api/v1/products/{id}/publish` | Advance listing status |
| POST | `/api/v1/products/{id}/promote` | Advance promotion status |
| GET | `/api/v1/ingestions` | List ingestion runs |
| GET | `/api/v1/ingestions/{id}` | Track per-service upload status |

## Upload agent (queue + status)

`POST /api/v1/products/upload` requires `description` and at least one `image_url`, then:

1. Stores product in gateway catalog
2. Creates an `IngestionRun` with queued steps
3. Publishes messages to the ingestion queue
4. Dispatches to catalog → listing → promotion → worker
5. Updates each step to `running` / `completed` / `failed`

Poll status:

```bash
curl -X POST http://127.0.0.1:8001/api/v1/products \
curl http://127.0.0.1:8001/api/v1/ingestions/1
```

## Example upload

```bash
curl -X POST http://127.0.0.1:8001/api/v1/products/upload \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Desk Lamp",
    "category": "Home",
    "price": 39.99,
    "marketplaces": ["amazon"],
    "description": "LED desk lamp with USB charging.",
    "image_urls": ["https://cdn.example.com/lamp.jpg"],
    "daily_budget": 20.0,
    "auto_activate_listings": true
  }'
```

Publish to Flipkart:

```bash
curl -X POST http://127.0.0.1:8001/api/v1/products/1/publish \
  -H "Content-Type: application/json" \
  -d '{"marketplace": "flipkart"}'
```
