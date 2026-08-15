# Humachine

Multi-marketplace ecommerce control center for managing product drafts, listings, and promotions across Amazon, Flipkart, and Meesho.

## Repository layout

```text
frontend/                 React + TypeScript admin dashboard
services/api_gateway/     FastAPI gateway for frontend APIs
docs/                     Project architecture and workflow docs
.cursor/skills/           Cursor agent skills for this repo
```

## Quick start

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

App: `http://localhost:5173`

Docker:

```bash
docker compose up --build frontend
```

App (container): `http://localhost:8000`

### API gateway

```bash
cd services/api_gateway
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --reload --port 8001
```

API docs: `http://127.0.0.1:8001/docs`

## Skills covered in this project

- Catalog draft creation and validation
- Per-marketplace listing control (Amazon, Flipkart, Meesho)
- Listing readiness and submission tracking
- Promotion launch after marketplace activation
- Frontend E2E testing with Playwright
- Python API gateway development with FastAPI

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Skills](docs/SKILLS.md)
- [Frontend setup](frontend/docs/SETUP.md)
- [API gateway setup](services/api_gateway/docs/SETUP.md)

## Cursor agent skills

Located in `.cursor/skills/`:

- `ecommerce-marketplace-workflow`
- `api-gateway-service`
- `frontend-control-center`
- `playwright-e2e-testing`
- `listing-promotion-services`

## Planned services

1. `catalog_service` — product storage and validation
2. `listing_service` — marketplace publishing (SP-API and channel APIs)
3. `promotion_service` — campaign automation
4. `worker_service` — background jobs and sync
