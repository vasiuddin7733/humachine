# Tools

Shared tools for humachine agents. Usable by Cursor, Claude, Claude Code, CI, or humans — not locked to one AI product.

## Index

| Tool | Type | Purpose |
|------|------|---------|
| [`upload_product.sh`](upload_product.sh) | shell | Upload product images/content via gateway |
| [`status_poll.sh`](status_poll.sh) | shell | Poll ingestion run status |
| [`http_check.sh`](http_check.sh) | shell | Health-check all service ports |
| [`env_check.sh`](env_check.sh) | shell | Print key agent env vars |
| [`README.md`](README.md) | docs | This index |

## Conventions

- Prefer scripts that call public HTTP APIs (gateway on `:8001`)
- Read hosts/ports from env when possible; defaults match local Docker
- Keep tools side-effect clear (upload vs read-only poll)

## Env defaults

```bash
export API_GATEWAY_URL="${API_GATEWAY_URL:-http://127.0.0.1:8001}"
```

## Adding a tool

1. Add script or module under `agent-infra/tools/`
2. Document it in this README
3. Reference it from the related `agents/*/AGENT.md` and `skills/*/SKILL.md`
