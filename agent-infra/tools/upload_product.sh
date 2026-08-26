#!/usr/bin/env bash
# Upload product images + content through the ingestion agent.
set -euo pipefail

API_GATEWAY_URL="${API_GATEWAY_URL:-http://127.0.0.1:8001}"

curl -sS -X POST "${API_GATEWAY_URL}/api/v1/products/upload" \
  -H "Content-Type: application/json" \
  -d "${1:-$(cat <<'EOF'
{
  "title": "Desk Lamp",
  "category": "Home",
  "price": 39.99,
  "marketplaces": ["amazon"],
  "description": "LED desk lamp with USB charging.",
  "image_urls": ["https://cdn.example.com/lamp.jpg"],
  "daily_budget": 20.0,
  "auto_activate_listings": true
}
EOF
)}"
echo
