# Frontend Control Center

This frontend is a React + TypeScript dashboard for a multi-marketplace ecommerce workflow. It demonstrates the user journey from product draft to marketplace activation and finally promotion launch across Amazon, Flipkart, and Meesho.

## What it includes

- Product draft form for title, category, and price
- Product queue with per-marketplace listing and promotion badges
- Marketplace tabs for Amazon, Flipkart, and Meesho
- Control-flow detail panel that advances each marketplace workflow independently
- Playwright end-to-end test for the Flipkart happy path

## Skills and tools

### Workflow skills shown in the UI

- Product draft creation
- Listing readiness review
- Amazon, Flipkart, and Meesho listing tracking
- Promotion launch after activation

### Development tools

- `pnpm` for package management
- `React` + `TypeScript` for the frontend
- `Vite` for local development and builds
- `Playwright` for end-to-end browser testing
- `Oxlint` for linting

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm test:e2e
```

## Docker

Build and run from repo root:

```bash
docker compose up --build frontend
```

Or from `frontend/`:

```bash
docker build -t humachine-frontend .
docker run --rm -p 8000:8000 humachine-frontend
```

App: `http://localhost:8000`

Files:
- `Dockerfile` — multi-stage build with pnpm + nginx
- `.dockerignore` — excludes node_modules, tests, docs, and artifacts
- `nginx.conf` — SPA routing for Vite build output

## Test setup

The Playwright config starts the Vite preview server automatically on port `4173` and runs the browser test in `tests/app.spec.ts`.

If this is your first time using Playwright on the machine, install the browser binaries with:

```bash
pnpm exec playwright install chromium
```

## Additional docs

- `docs/SETUP.md` for local setup, testing, and extension guidance

## Test artifacts

Playwright output is ignored via root and frontend gitignore rules:

- `test-results/`
- `playwright-report/`
