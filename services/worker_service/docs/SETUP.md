# Worker Service Setup

## Prerequisites

- Python 3.11+
- `pip` and `venv`

## Install

```bash
cd services/worker_service
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
```

## Run

```bash
uvicorn app.main:app --reload --port 8005
```

## Test

```bash
pytest
```

## Docker

From repository root:

```bash
docker compose up --build worker_service
```

From `services/worker_service/`:

```bash
docker build -t humachine-worker-service .
docker run --rm -p 8005:8005 humachine-worker-service
```

API docs: `http://127.0.0.1:8005/docs`

Host port and container port are both `8005`.

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `WORKER_SERVICE_APP_NAME` | Humachine Worker Service | Service title |
| `WORKER_SERVICE_API_PREFIX` | `/api/v1` | API route prefix |
| `WORKER_SERVICE_ENVIRONMENT` | `development` | Runtime environment |
| `WORKER_SERVICE_PORT` | `8005` | Service port |
| `WORKER_SERVICE_ALLOWED_ORIGINS` | frontend/gateway URLs | CORS origins |

## Job types

| Type | Purpose |
|------|---------|
| `sync_listing` | Poll marketplace listing status |
| `sync_promotion` | Poll campaign status and performance |
| `publish_retry` | Retry a failed listing publish |
| `inventory_sync` | Sync SKU inventory across channels |

## Job state machine

```text
queued → running → completed
         ↓
       failed → (retry) → queued
```

Call `POST /api/v1/jobs/{id}/run` twice to simulate execution (queued → running → completed).

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check |
| GET | `/api/v1/marketplaces` | List supported marketplaces |
| GET | `/api/v1/jobs` | List jobs (optional `?job_type=` and `?status=`) |
| POST | `/api/v1/jobs` | Enqueue a background job |
| GET | `/api/v1/jobs/{id}` | Get job by id |
| GET | `/api/v1/jobs/{id}/status` | Get job status |
| POST | `/api/v1/jobs/{id}/run` | Advance job execution |
| POST | `/api/v1/jobs/{id}/retry` | Re-queue a failed job |

## Example requests

Enqueue listing sync:

```bash
curl -X POST http://127.0.0.1:8005/api/v1/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "job_type": "sync_listing",
    "product_id": 1,
    "listing_id": 3,
    "marketplace": "amazon",
    "sku": "SKU-HOME-102"
  }'
```

Run job (call twice to complete):

```bash
curl -X POST http://127.0.0.1:8005/api/v1/jobs/1/run
```

Check status:

```bash
curl http://127.0.0.1:8005/api/v1/jobs/1/status
```

Retry failed job:

```bash
curl -X POST http://127.0.0.1:8005/api/v1/jobs/1/retry
```
