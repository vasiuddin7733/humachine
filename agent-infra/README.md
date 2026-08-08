# Agent Infra

Portable AI agent infrastructure for humachine. Works with **Cursor**, **Claude**, **Claude Code**, and other AI coding tools — not Cursor-only.

## Layout

```text
agent-infra/
  agents/     Runtime agent specs (what each agent does)
  skills/     Domain skills AI assistants should follow
  tools/      Shared tools agents call (scripts + helpers)
```

## How different AI tools use this

| Tool | How to load |
|------|-------------|
| **Any AI** | Read `agent-infra/README.md`, then the relevant `agents/` + `skills/` files |
| **Claude / Claude Code** | Root `CLAUDE.md` points here; open `agent-infra/` as project context |
| **Cursor** | `.cursor/skills/` mirrors `agent-infra/skills/` for auto-discovery |

**Source of truth:** `agent-infra/`. Keep Cursor copies in sync when editing skills.

## Agents

| Agent | Spec | Runtime code |
|-------|------|--------------|
| Product ingestion | [`agents/product-ingestion/AGENT.md`](agents/product-ingestion/AGENT.md) | `services/api_gateway/app/agents/ingestion_agent.py` |
| Dispatch | [`agents/dispatch/AGENT.md`](agents/dispatch/AGENT.md) | `services/api_gateway/app/agents/dispatch_agent.py` |

## Skills

All skills live under [`skills/`](skills/). Index: [`skills/README.md`](skills/README.md).

## Tools

Reusable helpers under [`tools/`](tools/) for upload, queue, status polling, and HTTP checks.

## Flow

```text
upload product images + content
  → product-ingestion agent (validate, store, enqueue)
  → message queue
  → dispatch agent (call catalog / listing / promotion / worker)
  → status tracker (poll GET /api/v1/ingestions/{id})
```
