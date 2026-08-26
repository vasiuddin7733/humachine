#!/usr/bin/env bash
# Poll ingestion run status (Agent 2 tracking).
set -euo pipefail

API_GATEWAY_URL="${API_GATEWAY_URL:-http://127.0.0.1:8001}"
RUN_ID="${1:?usage: status_poll.sh <run_id>}"

curl -sS "${API_GATEWAY_URL}/api/v1/ingestions/${RUN_ID}"
echo
