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
- Routes for products, marketplaces, publish, and promote actions

## Control flow

1. Operator creates a product draft.
2. Operator selects target marketplaces.
3. Listing moves through `draft → ready → submitted → active` per channel.
4. Promotion moves through `not_started → scheduled → live` after listing activation.
5. Future worker jobs will sync status with real marketplace APIs.

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

## Next backend services

| Service | Status | Responsibility |
|---------|--------|----------------|
| `catalog_service` | Active (MVP) | Product CRUD, validation, SKU rules |
| `listing_service` | Active (MVP) | Marketplace publish + status transitions |
| `promotion_service` | Active (MVP) | Campaign creation and launch |
| `worker_service` | Planned | Celery jobs, retries, scheduled sync |

## Integration plan

1. Replace frontend local state with API gateway calls.
2. Move catalog store from memory to PostgreSQL.
3. Add listing and promotion microservices behind the gateway.
4. Connect official marketplace APIs instead of mock transitions.
