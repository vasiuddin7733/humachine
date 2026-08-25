# Architecture

## Goal

Build an ecommerce operator dashboard that manages the full flow from product draft to marketplace listing and promotion across Amazon, Flipkart, and Meesho.

## Current components

### Frontend (`frontend/`)

- React + TypeScript + Vite + Tailwind CSS
- Local UI state for product queue and marketplace tabs
- Playwright tests for the Flipkart happy path

### Catalog service (`services/catalog_service/`)

- FastAPI microservice for product CRUD
- Validates drafts and marketplace assignments
- Initializes per-channel state for listing/promotion workflows

### Listing service (`services/listing_service/`)

- FastAPI microservice for marketplace listing publish flow
- Advances status: `draft → ready → submitted → active`
- Assigns mock external listing IDs for Amazon, Flipkart, and Meesho

### Promotion service (`services/promotion_service/`)

- FastAPI microservice for campaign creation and launch
- Advances status: `not_started → scheduled → live`
- Requires an active listing before campaign creation

### API gateway (`services/api_gateway/`)

- FastAPI entrypoint for the frontend
- In-memory catalog store for MVP development
- Product ingestion uses **two agents** in `app/agents/`:
  - **Ingestion agent** — validate upload, store draft, enqueue messages
  - **Dispatch agent** — consume queue, call catalog/listing/promotion/worker, track status
- Queue backend: in-memory (local) or Redis (Docker)

### Worker service (`services/worker_service/`)

- FastAPI microservice for background job enqueue and status tracking
- Job types: listing sync, promotion sync, publish retry, inventory sync
- Advances status: `queued → running → completed` (with retry on failure)
- MVP uses in-memory job store; Redis-backed Celery workers can replace mocks later

## Control flow

1. Operator uploads product images and content via `POST /api/v1/products/upload`.
2. Gateway stores the draft, creates an ingestion run, and publishes queue messages.
3. Agent dispatches catalog → listing → promotion → worker and updates step status.
4. Operator polls `GET /api/v1/ingestions/{id}` to track progress.
5. Listing moves through `draft → ready → submitted → active` per channel (auto-activate optional).
6. Promotion starts after listing activation; worker jobs sync status and retries.

## Marketplace model

Each product stores independent channel state:

```json
{
  "marketplaces": ["amazon", "flipkart", "meesho"],
  "channels": {
    "amazon": {
      "listing_status": "ready",
      "promotion_status": "not_started"
    }
  }
}
```

## Backend services

| Service | Port | Status | Responsibility |
|---------|------|--------|----------------|
| `api_gateway` | 8001 | Active (MVP) | Frontend API entrypoint |
| `catalog_service` | 8002 | Active (MVP) | Product CRUD, validation, SKU rules |
| `listing_service` | 8003 | Active (MVP) | Marketplace publish + status transitions |
| `promotion_service` | 8004 | Active (MVP) | Campaign creation and launch |
| `worker_service` | 8005 | Active (MVP) | Background jobs, retries, scheduled sync |

## Shared packages (planned)

| Package | Path | Responsibility |
|---------|------|----------------|
| `shared_schemas` | `packages/shared_schemas/` | Shared Pydantic models / DTOs across services |

## Infrastructure (planned)

| Component | Path | Responsibility |
|-----------|------|----------------|
| Docker configs | `infra/docker/` | Shared compose overrides and build helpers |
| Nginx | `infra/nginx/` | Reverse proxy for frontend and API gateway |

## Integration plan

1. Replace frontend local state with API gateway calls.
2. Move catalog store from memory to PostgreSQL.
3. Add listing and promotion microservices behind the gateway.
4. Connect official marketplace APIs instead of mock transitions.
