#!/usr/bin/env bash
# Health-check frontend + all microservices.
set -euo pipefail

for port in 8000 8001 8002 8003 8004 8005; do
  if [ "$port" = "8000" ]; then
    code=$(curl -sS -o /dev/null -w "%{http_code}" "http://127.0.0.1:${port}/" || true)
  else
    code=$(curl -sS -o /dev/null -w "%{http_code}" "http://127.0.0.1:${port}/health" || true)
  fi
  echo "port ${port}: ${code}"
done
