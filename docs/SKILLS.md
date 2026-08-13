# Skills

Operator and developer skills supported by the humachine ecommerce ecommerce platform.

## Operator skills (business workflow)

| Skill | Description |
|-------|-------------|
| **Catalog ops** | Create product drafts with title, category, price, and SKU |
| **Marketplace control** | Manage Amazon, Flipkart, and Meesho listings independently |
| **Listing readiness** | Validate product data before submission |
| **Promotion automation** | Launch campaigns only after a listing is active |

## Developer skills (implementation)

| Skill | Stack | Location |
|-------|-------|----------|
| **Frontend dashboard** | React, TypeScript, Tailwind, Vite | `frontend/` |
| **Catalog service** | FastAPI, Pydantic, pytest | `services/catalog_service/` |
| **API gateway** | FastAPI, Pydantic, pytest | `services/api_gateway/` |
| **E2E testing** | Playwright, pnpm | `frontend/tests/` |
| **Listing services** | Python microservices (planned) | `services/listing_service/` |
| **Promotion services** | Python microservices (planned) | `services/promotion_service/` |

## Cursor agent skills

These teach Cursor how to work in this repo. Stored in `.cursor/skills/`:

1. `ecommerce-marketplace-workflow` — state machines and validation rules
2. `api-gateway-service` — FastAPI gateway patterns
3. `catalog-service` — product CRUD and validation
4. `frontend-control-center` — React UI and pnpm commands
5. `playwright-e2e-testing` — test writing and locator fixes
6. `listing-promotion-services` — future microservice scaffolding

See [`.cursor/skills/README.md`](../.cursor/skills/README.md) for the agent index.

## Listing state machine

```text
draft → ready → submitted → active
```

## Promotion state machine

```text
not_started → scheduled → live
(requires listing_status = active)
```

## UI skills panel

The frontend dashboard displays operator skills in the **Skills** section of `frontend/src/App.tsx`.
