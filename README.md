# Humachine Ecommerce

Multi-marketplace ecommerce control center for managing product drafts, listings, and promotions across Amazon, Flipkart, and Meesho.

## Repository layout

```text
frontend/                   React + TypeScript admin dashboard
services/
  api_gateway/              FastAPI gateway for frontend APIs
  catalog_service/          FastAPI product catalog microservice
  listing_service/          FastAPI marketplace listing microservice
  promotion_service/        FastAPI promotion campaign microservice
  worker_service/           Background jobs, sync, and retries
packages/
  shared_schemas/           Shared Pydantic models (planned)
infra/
  docker/                   Shared Docker configs (planned)
  nginx/                    Reverse proxy configs (planned)
docs/                       Project architecture and workflow docs
.cursor/skills/             Cursor agent skills for this repo
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

### Catalog service

```bash
cd services/catalog_service
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --reload --port 8002
pytest
```

API docs: `http://127.0.0.1:8002/docs`

Docker:

```bash
docker compose up --build catalog_service
```

### Listing service

```bash
cd services/listing_service
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --reload --port 8003
pytest
```

API docs: `http://127.0.0.1:8003/docs`

Docker:

```bash
docker compose up --build listing_service
```

### Promotion service

```bash
cd services/promotion_service
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --reload --port 8004
pytest
```

API docs: `http://127.0.0.1:8004/docs`

Docker:

```bash
docker compose up --build promotion_service
```

### Worker service

```bash
cd services/worker_service
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
uvicorn app.main:app --reload --port 8005
pytest
```

API docs: `http://127.0.0.1:8005/docs`

Docker:

```bash
docker compose up --build worker_service
```

## Port map

| Service | Port |
|---------|------|
| Frontend | 8000 |
| API gateway | 8001 |
| Catalog service | 8002 |
| Listing service | 8003 |
| Promotion service | 8004 |
| Worker service | 8005 |

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
- [Catalog service setup](services/catalog_service/docs/SETUP.md)
- [Listing service setup](services/listing_service/docs/SETUP.md)
- [Promotion service setup](services/promotion_service/docs/SETUP.md)
- [Worker service setup](services/worker_service/docs/SETUP.md)

## Cursor agent skills

Located in `.cursor/skills/`:

- `ecommerce-marketplace-workflow`
- `api-gateway-service`
- `catalog-service`
- `listing-service`
- `promotion-service`
- `worker-service`
- `frontend-control-center`
- `playwright-e2e-testing`
- `listing-promotion-services`
