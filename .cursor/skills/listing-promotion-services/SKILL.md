---
name: listing-promotion-services
description: Design and scaffold listing_service and promotion_service Python microservices for humachine ecommerce. Use when building marketplace publishing, Amazon SP-API integration, Flipkart/Meesho listing jobs, or automated promotion campaigns.
---

# Listing and Promotion Services

## Planned services

| Service | Path | Role |
|---------|------|------|
| `listing_service` | `services/listing_service/` | Publish and sync marketplace listings |
| `promotion_service` | `services/promotion_service/` | Create and manage ad campaigns |
| `worker_service` | `services/worker_service/` | Celery jobs, retries, polling |

## Listing flow

1. Gateway receives publish request for a marketplace
2. `listing_service` fetches product from catalog
3. Map internal schema to marketplace payload
4. Submit via official API (not browser automation)
5. Worker polls status and updates gateway/catalog

## Promotion flow

1. Verify listing is `active` on target marketplace
2. `promotion_service` creates campaign with budget rules
3. Worker syncs campaign status and performance

## Marketplace APIs

- **Amazon**: Seller Partner API (SP-API)
- **Flipkart**: Seller API (official integration)
- **Meesho**: Official seller/channel APIs

## Scaffold conventions

Match `services/api_gateway/` structure:

```text
app/
  main.py
  config.py
  routers/
  schemas/
  services/
tests/
pyproject.toml
README.md
docs/SETUP.md
```

## State transitions (keep in sync with gateway)

Listing: `draft → ready → submitted → active`

Promotion: `not_started → scheduled → live` (only when listing is active)

## Reference

- Gateway schemas: `services/api_gateway/app/schemas/product.py`
- Architecture: `docs/ARCHITECTURE.md`
