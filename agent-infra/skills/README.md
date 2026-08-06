# Skills (portable)

Source of truth for humachine domain skills. Usable by **Cursor**, **Claude**, and other AI tools.

Cursor auto-loads a copy under `.cursor/skills/` — keep both in sync when editing. Prefer editing here first.

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
| [listing-promotion-services](listing-promotion-services/SKILL.md) | Listing/promotion/worker scaffolding |

Also see: [`../agents/`](../agents/), [`../tools/`](../tools/), root [`CLAUDE.md`](../../CLAUDE.md)
