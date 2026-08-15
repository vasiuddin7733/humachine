---
name: frontend-control-center
description: Build and test the React TypeScript frontend in humachine. Use when editing the ecommerce dashboard, Tailwind UI, marketplace tabs, Playwright e2e tests, or pnpm/Vite commands for frontend/.
---

# Frontend Control Center

## Stack

- React 19 + TypeScript + Vite 8
- Tailwind CSS v4 via `@tailwindcss/vite`
- Playwright for e2e tests
- pnpm for package management

## Commands

```bash
cd frontend
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm test:e2e
```

Run dev from `frontend/`, not repo root.

## UI areas in App.tsx

- Metrics summary (active/pending/promotions)
- Workflow steps and skills cards
- Product draft form with marketplace checkboxes
- Product queue with per-channel badges
- Detail panel with marketplace tabs and action button

## Testing

- E2E config: `frontend/playwright.config.ts`
- Main test: `frontend/tests/app.spec.ts`
- Use exact button names and scoped locators to avoid strict-mode violations
- Install browser once: `pnpm exec playwright install chromium`

## Styling

- Tailwind utility classes in components
- Global styles in `frontend/src/index.css` with `@import "tailwindcss"`
- Avoid adding new custom CSS files unless necessary

## Docs

- `frontend/README.md`
- `frontend/docs/SETUP.md`

## Integration note

Frontend currently uses local React state. When wiring to API gateway, replace state updates with calls to:

- `GET /api/v1/products`
- `POST /api/v1/products`
- `POST /api/v1/products/{id}/publish`
- `POST /api/v1/products/{id}/promote`
