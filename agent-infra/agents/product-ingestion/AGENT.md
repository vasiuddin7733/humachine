---
name: product-ingestion
role: agent-1
description: After product images and content upload, validate payload, store draft, start status run, and enqueue catalog/listing/promotion/worker work on the message queue.
---

# Product Ingestion Agent

## Purpose

Automatically start downstream processing when an operator uploads product **images** and **content**.

## Triggers

- `POST /api/v1/products/upload`
- Required: `description`, at least one `image_urls` entry, plus title/category/price/marketplaces

## Steps

1. Validate images + content
2. Store product draft in gateway catalog
3. Create `IngestionRun` with steps for catalog, listing, promotion, worker
4. Publish queue messages (catalog → listing → promotion → worker)
5. Hand off to **dispatch** agent to consume the queue

## Runtime

- Code: `services/api_gateway/app/agents/ingestion_agent.py`
- Queue: `services/api_gateway/app/services/message_queue.py`
- Status: `services/api_gateway/app/services/status_tracker.py`

## Related

- Skill: `agent-infra/skills/product-ingestion-agent/SKILL.md`
- Next agent: `agent-infra/agents/dispatch/AGENT.md`
- Tools: `agent-infra/tools/upload_product.sh`, `agent-infra/tools/status_poll.sh`
