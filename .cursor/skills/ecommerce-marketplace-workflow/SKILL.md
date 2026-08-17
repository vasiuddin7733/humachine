---
name: ecommerce-marketplace-workflow
description: Guide multi-marketplace ecommerce workflows for Amazon, Flipkart, and Meesho. Use when building product listing flows, promotion automation, catalog-to-marketplace state machines, or backend/frontend features for humachine.
---

# Ecommerce Marketplace Workflow

## Business flow

Follow this order when adding features:

1. Create product draft (title, category, price, SKU)
2. Select marketplaces: `amazon`, `flipkart`, `meesho`
3. Advance listing per channel: `draft → ready → submitted → active`
4. Advance promotion only after listing is `active`: `not_started → scheduled → live`

Each marketplace has independent state. Never assume one channel status applies to another.

## Data model

```python
channels: dict[Marketplace, ChannelState]
ChannelState = {
  listing_status: draft | ready | submitted | active
  promotion_status: not_started | scheduled | live
}
```

## Validation rules

- Product must have at least one marketplace
- Promotion requires `listing_status == active`
- Publish/promote actions are marketplace-specific

## Repo locations

- Frontend UI: `frontend/src/App.tsx`
- Gateway schemas: `services/api_gateway/app/schemas/product.py`
- Catalog logic: `services/api_gateway/app/services/catalog.py`
- Architecture: `docs/ARCHITECTURE.md`

## When extending

- Add new marketplace to `Marketplace` enum in both frontend types and backend schema
- Update seed data, badges, and Playwright selectors together
- Prefer API gateway routes over direct frontend-only state for new features
