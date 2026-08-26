---
name: dispatch
role: agent-2
description: Consume ingestion queue messages, call catalog/listing/promotion/worker HTTP APIs, and update per-service status for tracking.
---

# Dispatch Agent

## Purpose

Track and execute work published by the ingestion agent. Main focus: **status tracking** + **fan-out requests** to microservices.

## Triggers

- Called after ingestion agent enqueues messages
- `dispatch_agent.dispatch_queued()` drains the message queue

## Steps

1. Drain messages from the ingestion queue (memory or Redis)
2. Mark each service step `running`
3. Call downstream HTTP APIs:
   - catalog → `POST /api/v1/products`
   - listing → `POST /api/v1/listings` (+ optional publish to active)
   - promotion → `POST /api/v1/campaigns`
   - worker → `POST /api/v1/jobs`
4. Mark each step `completed` or `failed`
5. Expose overall run via `GET /api/v1/ingestions/{id}`

## Runtime

- Code: `services/api_gateway/app/agents/dispatch_agent.py`
- Service URLs from `API_GATEWAY_*_SERVICE_URL` env vars

## Related

- Skill: `agent-infra/skills/dispatch-agent/SKILL.md`
- Previous agent: `agent-infra/agents/product-ingestion/AGENT.md`
- Tools: `agent-infra/tools/http_check.sh`, `agent-infra/tools/status_poll.sh`
