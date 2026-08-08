# Listing Service Setup

## Prerequisites

- Python 3.11+
- `pip` and `venv`

## Install

```bash
cd services/listing_service
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
```

## Run

```bash
uvicorn app.main:app --reload --port 8003
```

## Test

```bash
pytest
```

## Docker

From repository root:

```bash
docker compose up --build listing_service
```

From `services/listing_service/`:

```bash
docker build -t humachine-listing-service .
docker run --rm -p 8003:8003 humachine-listing-service
```

API docs: `http://127.0.0.1:8003/docs`

Host port and container port are both `8003`.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LISTING_SERVICE_APP_NAME` | Humachine Listing Service | Service title |
| `LISTING_SERVICE_API_PREFIX` | `/api/v1` | API route prefix |
| `LISTING_SERVICE_ENVIRONMENT` | `development` | Runtime environment |
| `LISTING_SERVICE_PORT` | `8003` | Service port |
| `LISTING_SERVICE_REDIS_URL` | `redis://127.0.0.1:6379/0` | Shared queue broker |
| `LISTING_SERVICE_QUEUE_NAME` | `humachine.ingestion` | Shared queue name |
| `LISTING_SERVICE_ALLOWED_ORIGINS` | frontend/gateway URLs | CORS origins |

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| GET | `/api/v1/marketplaces` | List supported marketplaces |
| GET | `/api/v1/listings` | List listings (optional `?marketplace=`) |
| POST | `/api/v1/listings` | Create listing draft |
| GET | `/api/v1/listings/{id}` | Get listing by id |
| GET | `/api/v1/listings/{id}/status` | Get listing status |
| POST | `/api/v1/listings/{id}/publish` | Advance listing status |

## Listing state machine

```text
draft → ready → submitted → active
```

On transition from `ready` to `submitted`, a mock external listing id is assigned
(`AMZ-MOCK-*`, `FK-MOCK-*`, or `MS-MOCK-*`).

## Example requests

Create listing:

```bash
curl -X POST http://127.0.0.1:8003/api/v1/listings \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "sku": "SKU-HOME-101",
    "title": "Desk Lamp",
    "marketplace": "amazon",
    "price": 39.99
  }'
```

Publish listing (call repeatedly to advance status):

```bash
curl -X POST http://127.0.0.1:8003/api/v1/listings/1/publish
```

Check status:

```bash
curl http://127.0.0.1:8003/api/v1/listings/1/status
```
