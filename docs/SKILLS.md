# Skills

Operator and developer skills supported by the humachine ecommerce platform.

## Operator skills (business workflow)

| Skill | Description |
|-------|-------------|
| **Catalog ops** | Create product drafts with title, category, price, and SKU |
| **Marketplace control** | Manage Amazon, Flipkart, and Meesho listings independently |
| **Listing readiness** | Validate product data before submission |
| **Promotion automation** | Launch campaigns only after a listing is active |
| **Product ingestion** | Upload images/content and auto-fan-out to microservices |

## Developer skills (implementation)

| Skill | Stack | Location |
|-------|-------|----------|
| **Frontend dashboard** | React, TypeScript, Tailwind, Vite | `frontend/` |
| **Catalog service** | FastAPI, Pydantic, pytest | `services/catalog_service/` |
| **API gateway** | FastAPI, Pydantic, pytest | `services/api_gateway/` |
| **E2E testing** | Playwright, pnpm | `frontend/tests/` |
| **Listing service** | FastAPI, Pydantic, pytest | `services/listing_service/` |
| **Promotion service** | FastAPI, Pydantic, pytest | `services/promotion_service/` |
| **Worker service** | FastAPI, Pydantic, pytest | `services/worker_service/` |

## Portable AI infra (any tool)

Source of truth: [`agent-infra/`](../agent-infra/)

| Folder | Purpose |
|--------|---------|
| `agent-infra/agents/` | Agent specs (ingestion, dispatch) |
| `agent-infra/skills/` | Domain skills for Cursor, Claude, etc. |
| `agent-infra/tools/` | Shared scripts (upload, status, health) |

Claude entrypoint: [`CLAUDE.md`](../CLAUDE.md)  
Cursor mirror: [`.cursor/skills/`](../.cursor/skills/)

## Skill list

1. `ecommerce-marketplace-workflow` — state machines and validation rules
2. `api-gateway-service` — FastAPI gateway patterns
3. `product-ingestion-agent` — upload enqueue (Agent 1)
4. `dispatch-agent` — queue consumer + status tracking (Agent 2)
5. `catalog-service` — product CRUD and validation
6. `listing-service` — marketplace publish and status transitions
7. `promotion-service` — campaign creation and launch
8. `worker-service` — background jobs, sync, and retries
9. `frontend-control-center` — React UI and pnpm commands
10. `playwright-e2e-testing` — test writing and locator fixes
11. `listing-promotion-services` — listing/promotion/worker scaffolding

## Listing state machine

```text
draft → ready → submitted → active
```

## Promotion state machine

```text
not_started → scheduled → live
(requires listing_status = active)
```

## Worker job state machine

```text
queued → running → completed
         ↓
       failed → (retry) → queued
```

## UI skills panel

The frontend dashboard displays operator skills in the **Skills** section of `frontend/src/App.tsx`.
