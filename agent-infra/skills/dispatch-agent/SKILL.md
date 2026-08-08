---
name: dispatch-agent
description: Develop the api_gateway dispatch agent that consumes the ingestion message queue, calls catalog/listing/promotion/worker HTTP APIs, and updates per-service status. Use when wiring queue consumers, downstream HTTP fan-out, or status_tracker step updates.
---

# Dispatch Agent

## Role

**Agent 2** in `services/api_gateway/app/agents/`. Consumes queue messages published by the ingestion agent and tracks each downstream call.

## Location

```text
app/agents/
  dispatch_agent.py    DispatchAgent — queue consumer + HTTP fan-out
  ingestion_agent.py     ProductIngestionAgent — upload + enqueue
```

## Flow

```text
message_queue.drain()
  → mark step running
  → POST catalog / listing / promotion / worker
  → mark step completed|failed
```

## Implementation

- Class: `DispatchAgent` in `app/agents/dispatch_agent.py`
- Singleton: `dispatch_agent`
- Status store: `app/services/status_tracker.py`
- Queue: `app/services/message_queue.py`

## Service targets

| Target | HTTP endpoint |
|--------|---------------|
| `catalog_service` | `POST /api/v1/products` |
| `listing_service` | `POST /api/v1/listings` (+ optional publish) |
| `promotion_service` | `POST /api/v1/campaigns` |
| `worker_service` | `POST /api/v1/jobs` |

## Environment variables

Read from `API_GATEWAY_*_SERVICE_URL` in `app/config.py`. Do not hardcode hosts.

## Rules

- Keep HTTP logic in the dispatch agent, not in routers
- Promotion requires listing context from the same dispatch batch
- Always update `status_tracker` on running/completed/failed
