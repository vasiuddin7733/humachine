# Docker Infrastructure

Planned shared Docker configuration for humachine services.

## Purpose

- Compose overrides for production and staging
- Shared build helpers and multi-service orchestration

## Status

Each service currently has its own `Dockerfile`. Root `docker-compose.yml` orchestrates all services.

## Future layout

```text
infra/docker/
  compose.prod.yml
  compose.dev.yml
```
