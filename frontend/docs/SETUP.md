# Setup Guide

This guide explains how to run, test, and extend the multi-marketplace frontend.

## Stack

- `React` + `TypeScript`
- `Vite`
- `Tailwind CSS`
- `Playwright`
- `pnpm`

## Local setup

From the `frontend/` directory:

```bash
pnpm install
pnpm dev
```

The development app runs with Vite. If you want a fixed host and port, use:

```bash
pnpm dev --host 127.0.0.1 --port 4173
```

## Build and test

```bash
pnpm build
pnpm lint
pnpm test:e2e
```

## Docker

From repository root:

```bash
docker compose up --build frontend
```

From `frontend/`:

```bash
docker build -t humachine ecommerce-frontend .
docker run --rm -p 8000:8000 humachine ecommerce-frontend
```

The `.dockerignore` file keeps the image small by excluding:

- `node_modules/`
- `dist/`
- `tests/` and Playwright artifacts
- docs, editor files, and local env files

If Playwright browser binaries are not installed yet:

```bash
pnpm exec playwright install chromium
```

## Functional areas

### Product draft management

- Create product drafts with title, category, and price
- Choose marketplaces before listing
- Generate a simple SKU for mock workflow testing

### Marketplace control

- Manage `Amazon`, `Flipkart`, and `Meesho` per product
- Track listing states independently for each marketplace
- Review promotion readiness per channel

### Promotion workflow

- Move a listing from `draft` to `ready`
- Submit and activate a listing
- Schedule and launch a promotion once the listing is active

## Extension points

To connect this UI to the planned Python backend later, replace local component state with API calls for:

- product creation
- product list retrieval
- listing status updates
- promotion actions
- marketplace-specific job status

## Suggested next backend integrations

1. `catalog_service` for product storage
2. `listing_service` for Amazon, Flipkart, and Meesho publishing
3. `worker_service` for background state transitions
4. `promotion_service` for marketplace campaign automation

## GitHub Pages

Free static hosting for this frontend: see [docs/GITHUB_PAGES.md](../../docs/GITHUB_PAGES.md).

```bash
VITE_BASE_PATH=/humachine/ pnpm build
```

Attach backends with `VITE_API_GATEWAY_URL` (and other `VITE_*_URL` vars) from `frontend/.env.example`. GitHub Pages cannot host FastAPI services.
