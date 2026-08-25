# Nginx Infrastructure

Planned reverse proxy configuration for humachine.

## Purpose

- Route frontend traffic on port 80/443
- Proxy API requests to `api_gateway` and downstream microservices

## Status

Frontend currently serves via its own nginx config in `frontend/nginx.conf`.

## Future layout

```text
infra/nginx/
  nginx.conf
  conf.d/
    frontend.conf
    api.conf
```
