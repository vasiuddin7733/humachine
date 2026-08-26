#!/usr/bin/env bash
# Print agent-related environment variables (safe defaults if unset).
set -euo pipefail

vars=(
  API_GATEWAY_URL
  API_GATEWAY_CATALOG_SERVICE_URL
  API_GATEWAY_LISTING_SERVICE_URL
  API_GATEWAY_PROMOTION_SERVICE_URL
  API_GATEWAY_WORKER_SERVICE_URL
  API_GATEWAY_QUEUE_BACKEND
  API_GATEWAY_REDIS_URL
  API_GATEWAY_QUEUE_NAME
  API_GATEWAY_ORCHESTRATION_ENABLED
)

for name in "${vars[@]}"; do
  printf '%s=%s\n' "$name" "${!name:-<unset>}"
done
