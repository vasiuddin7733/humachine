# Claude / Claude Code project guide

This repo’s portable AI infrastructure lives in **`agent-infra/`** (not Cursor-only).

## Read first

1. [`agent-infra/README.md`](agent-infra/README.md)
2. Agents: [`agent-infra/agents/`](agent-infra/agents/)
3. Skills: [`agent-infra/skills/`](agent-infra/skills/)
4. Tools: [`agent-infra/tools/`](agent-infra/tools/)

## Product upload flow

When the user asks about upload → fan-out:

1. Follow **product-ingestion** agent (`agent-infra/agents/product-ingestion/AGENT.md`)
2. Then **dispatch** agent (`agent-infra/agents/dispatch/AGENT.md`)
3. Use tools under `agent-infra/tools/` for curl/status checks
4. Runtime Python: `services/api_gateway/app/agents/`

## Services

| Service | Port |
|---------|------|
| Frontend | 8000 |
| API gateway | 8001 |
| Catalog | 8002 |
| Listing | 8003 |
| Promotion | 8004 |
| Worker | 8005 |
| Redis | 6379 |

Env template: [`.env.example`](.env.example)
