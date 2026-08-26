---
name: product-ingestion-agent
description: Orchestrate api_gateway product image/content upload via message queue to catalog, listing, promotion, and worker services while tracking per-service status. Use when wiring POST /products/upload, Redis queue env vars, ingestion status polling, or downstream fan-out.
---

# Product Ingestion Agent

## Two agents in `app/agents/`

| Agent | File | Responsibility |
|-------|------|----------------|
| **Ingestion** | `ingestion_agent.py` | Validate upload, store draft, enqueue queue messages |
| **Dispatch** | `dispatch_agent.py` | Consume queue, call downstream services, track status |

See also: [dispatch-agent](../dispatch-agent/SKILL.md)

## Flow

```text
POST /api/v1/products/upload
  → ingestion_agent: store draft + start IngestionRun + publish queue messages
  → dispatch_agent: drain queue + HTTP fan-out + update step status
  → GET /api/v1/ingestions/{run_id}
```

## Implementation

| Piece | Path |
|-------|------|
| Ingestion agent | `app/agents/ingestion_agent.py` |
| Dispatch agent | `app/agents/dispatch_agent.py` |
| Queue | `app/services/message_queue.py` |
| Status | `app/services/status_tracker.py` |
| Upload route | `POST /api/v1/products/upload` |
| Status API | `GET /api/v1/ingestions/{run_id}` |

## Required upload fields

- `description` (content)
- `image_urls` (at least one)
- `title`, `category`, `price`, `marketplaces`

## Environment variables

Repo template: `.env.example`

### Gateway

| Variable | Default | Purpose |
|----------|---------|---------|
| `API_GATEWAY_CATALOG_SERVICE_URL` | `http://127.0.0.1:8002` | Catalog base URL |
| `API_GATEWAY_LISTING_SERVICE_URL` | `http://127.0.0.1:8003` | Listing base URL |
| `API_GATEWAY_PROMOTION_SERVICE_URL` | `http://127.0.0.1:8004` | Promotion base URL |
| `API_GATEWAY_WORKER_SERVICE_URL` | `http://127.0.0.1:8005` | Worker base URL |
| `API_GATEWAY_ORCHESTRATION_ENABLED` | `true` | Enable fan-out |
| `API_GATEWAY_QUEUE_BACKEND` | `memory` | `memory` or `redis` |
| `API_GATEWAY_REDIS_URL` | `redis://127.0.0.1:6379/0` | Broker URL |
| `API_GATEWAY_QUEUE_NAME` | `humachine.ingestion` | Queue key |

## Rules

- Ingestion agent enqueues; dispatch agent sends HTTP requests
- Prefer status tracking over fire-and-forget calls
- Promotion only after listing is active
- Do not hardcode service hosts — read from settings/env
