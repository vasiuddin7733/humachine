# Promotion Service Setup

## Prerequisites

- Python 3.11+
- `pip` and `venv`

## Install

```bash
cd services/promotion_service
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
```

## Run

```bash
uvicorn app.main:app --reload --port 8004
```

## Test

```bash
pytest
```

## Docker

From repository root:

```bash
docker compose up --build promotion_service
```

From `services/promotion_service/`:

```bash
docker build -t humachine-promotion-service .
docker run --rm -p 8004:8004 humachine-promotion-service
```

API docs: `http://127.0.0.1:8004/docs`

Host port and container port are both `8004`.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PROMOTION_SERVICE_APP_NAME` | Humachine Promotion Service | Service title |
| `PROMOTION_SERVICE_API_PREFIX` | `/api/v1` | API route prefix |
| `PROMOTION_SERVICE_ENVIRONMENT` | `development` | Runtime environment |
| `PROMOTION_SERVICE_PORT` | `8004` | Service port |
| `PROMOTION_SERVICE_ALLOWED_ORIGINS` | frontend/gateway URLs | CORS origins |

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| GET | `/api/v1/marketplaces` | List supported marketplaces |
| GET | `/api/v1/campaigns` | List campaigns (optional `?marketplace=`) |
| POST | `/api/v1/campaigns` | Create campaign draft |
| GET | `/api/v1/campaigns/{id}` | Get campaign by id |
| GET | `/api/v1/campaigns/{id}/status` | Get campaign status |
| POST | `/api/v1/campaigns/{id}/launch` | Advance campaign status |

## Promotion state machine

```text
not_started → scheduled → live
```

Requires `listing_is_active=true` when creating a campaign.

On transition from `not_started` to `scheduled`, a mock external campaign id is assigned
(`AMZ-ADS-*`, `FK-ADS-*`, or `MS-ADS-*`).

## Example requests

Create campaign:

```bash
curl -X POST http://127.0.0.1:8004/api/v1/campaigns \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "listing_id": 3,
    "sku": "SKU-HOME-102",
    "title": "Reusable Water Bottle",
    "marketplace": "amazon",
    "daily_budget": 25.0,
    "listing_is_active": true
  }'
```

Launch campaign (call repeatedly to advance status):

```bash
curl -X POST http://127.0.0.1:8004/api/v1/campaigns/1/launch
```

Check status:

```bash
curl http://127.0.0.1:8004/api/v1/campaigns/1/status
```
