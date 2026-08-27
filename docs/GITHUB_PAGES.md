# GitHub Pages (frontend)

Free static hosting for the React frontend via GitHub Actions + GitHub Pages.

**Important:** GitHub Pages cannot run FastAPI, Redis, or Docker. Backend services stay on Docker locally or on another free host (Render / Railway / Fly.io). The frontend attaches to them with `VITE_*_URL` variables.

## One-time GitHub setup

1. Open the repo on GitHub → **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**
3. (Optional) **Settings → Secrets and variables → Actions → Variables** — add:

| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_API_GATEWAY_URL` | `https://your-gateway.onrender.com` | API gateway |
| `VITE_CATALOG_SERVICE_URL` | `https://your-catalog.onrender.com` | Catalog |
| `VITE_LISTING_SERVICE_URL` | `https://your-listing.onrender.com` | Listing |
| `VITE_PROMOTION_SERVICE_URL` | `https://your-promotion.onrender.com` | Promotion |
| `VITE_WORKER_SERVICE_URL` | `https://your-worker.onrender.com` | Worker |

If variables are empty, the built UI still works in local-demo mode and shows connection status as unreachable on github.io.

4. Push to `main` (or run **Actions → Deploy GitHub Pages → Run workflow**)

Site URL:

```text
https://vasiuddin7733.github.io/humachine/
```

## Workflow

File: [`.github/workflows/deploy-gh-pages.yml`](../../.github/workflows/deploy-gh-pages.yml)

- Builds `frontend/` with `pnpm`
- Sets `VITE_BASE_PATH=/humachine/` (project Pages path)
- Injects service URLs from repository Variables
- Deploys `frontend/dist` to GitHub Pages

## CORS on backends

When the UI is on `https://vasiuddin7733.github.io`, every backend must allow that origin, for example:

```bash
API_GATEWAY_ALLOWED_ORIGINS='["https://vasiuddin7733.github.io"]'
```

Same pattern for `CATALOG_SERVICE_ALLOWED_ORIGINS`, `LISTING_SERVICE_*`, etc.

## Local preview of Pages build

```bash
cd frontend
VITE_BASE_PATH=/humachine/ pnpm build
pnpm preview --base /humachine/
```

## Attaching services

| Layer | Hosting |
|-------|---------|
| Frontend | GitHub Pages (this doc) |
| API gateway + microservices | Docker Compose locally, or free container hosts |
| Redis | Same host as backends (required for queue in compose) |

Config code: `frontend/src/config.ts`  
Connection UI: `frontend/src/ServiceConnections.tsx`
