# Shared Schemas

Planned shared Pydantic models and DTOs used across humachine microservices.

## Purpose

- Avoid duplicating product, listing, and campaign schemas in each service
- Provide a single source of truth for cross-service API contracts

## Status

Not yet implemented. Each service currently defines its own schemas locally.

## Future layout

```text
packages/shared_schemas/
  pyproject.toml
  shared_schemas/
    product.py
    listing.py
    campaign.py
    job.py
```
