# Agents

Portable agent definitions for humachine. These describe behavior for any AI tool; Python runtime lives under `services/api_gateway/app/agents/`.

| Agent | Spec | Responsibility |
|-------|------|----------------|
| [product-ingestion](product-ingestion/AGENT.md) | Agent 1 | After image/content upload: validate, store draft, enqueue work |
| [dispatch](dispatch/AGENT.md) | Agent 2 | Consume queue, call downstream services, track per-service status |

## Adding a new agent

1. Create `agent-infra/agents/<name>/AGENT.md`
2. Implement runtime in the appropriate service (usually `api_gateway`)
3. Add or update a matching skill under `agent-infra/skills/`
4. Register any shared helpers under `agent-infra/tools/`
5. Update this README and root `CLAUDE.md`
