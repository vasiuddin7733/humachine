# Cursor Skills Index

Cursor auto-discovers skills in `.cursor/skills/`.

**Portable source of truth:** [`agent-infra/skills/`](../../agent-infra/skills/)  
Agents + tools for any AI (Claude, Cursor, etc.): [`agent-infra/`](../../agent-infra/)

| Skill | Use when |
|-------|----------|
| [ecommerce-marketplace-workflow](ecommerce-marketplace-workflow/SKILL.md) | Listing/promotion state machines, Amazon/Flipkart/Meesho flows |
| [api-gateway-service](api-gateway-service/SKILL.md) | FastAPI routes, schemas, catalog store, pytest |
| [product-ingestion-agent](product-ingestion-agent/SKILL.md) | Upload enqueue agent (Agent 1) |
| [dispatch-agent](dispatch-agent/SKILL.md) | Queue consumer + status tracking (Agent 2) |
| [catalog-service](catalog-service/SKILL.md) | Product CRUD, validation, catalog microservice |
| [listing-service](listing-service/SKILL.md) | Marketplace publish, listing status transitions |
| [promotion-service](promotion-service/SKILL.md) | Campaign creation, promotion launch |
| [worker-service](worker-service/SKILL.md) | Background jobs, sync, publish retries |
| [frontend-control-center](frontend-control-center/SKILL.md) | React dashboard, Tailwind UI, Vite/pnpm |
| [playwright-e2e-testing](playwright-e2e-testing/SKILL.md) | Browser tests, selectors, CI e2e setup |
| [listing-promotion-services](listing-promotion-services/SKILL.md) | Future listing/promotion microservices |

When editing skills, update **`agent-infra/skills/`** first, then copy into `.cursor/skills/` so Cursor stays in sync.
