---
name: playwright-e2e-testing
description: Write and fix Playwright end-to-end tests for the humachine frontend. Use when adding e2e tests, debugging strict mode locator failures, configuring playwright.config.ts, or running pnpm test:e2e.
---

# Playwright E2E Testing

## Commands

```bash
cd frontend
pnpm test:e2e
pnpm exec playwright install chromium
```

Preview server starts automatically on port `4173` via `playwright.config.ts`.

## Test file

- Main flow: `frontend/tests/app.spec.ts`
- Config: `frontend/playwright.config.ts`

## Locator rules

Avoid ambiguous selectors that match multiple elements:

```typescript
// Bad — strict mode violation
page.getByText('Draft')
page.getByRole('button', { name: 'Amazon' })

// Good
page.getByRole('button', { name: 'Amazon', exact: true })
page.locator('span').filter({ hasText: 'Submitted to Flipkart' })
```

Use `exact: true` for marketplace tab buttons because product cards also contain marketplace names.

## Happy path to test

1. Create product via form
2. Select Flipkart tab
3. Mark listing ready → Submit → Activate
4. Launch promotion → Set campaign live
5. Assert status badges in detail panel

## Artifacts (gitignored)

- `frontend/test-results/`
- `frontend/playwright-report/`

## When UI button labels change

Update both `App.tsx` action labels and `tests/app.spec.ts` together. Button text is derived from marketplace name in `nextAction()`.
