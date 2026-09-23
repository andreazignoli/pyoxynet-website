#!/usr/bin/env bash
# Oxynet quick start with curl and jq.
#
#   export OXYNET_API_KEY=sk_live_...
#   ./quickstart.sh oxynet_sample.json
#
# Reference: https://www.oxynet.net/developers/api/v1
set -euo pipefail

BASE=https://app.oxynet.net
FILE=${1:-oxynet_sample.json}
KEY="X-API-Key: ${OXYNET_API_KEY:?set OXYNET_API_KEY first}"
JSON='Content-Type: application/json'

# 1. What this key may do (analyses are licensed separately) and its limits.
curl -sS --fail-with-body -H "$KEY" "$BASE/v1/capabilities" | jq '{analyses, limits}'

# 2. Upload the export unchanged. The response names the detected format and
#    every channel that is absent, with the reason.
ID=$(curl -sS --fail-with-body -H "$KEY" -F "file=@$FILE" "$BASE/v1/cpet" | jq -r .cpet_id)
echo "cpet_id: $ID"

# 3. Thresholds. Add "eov" and "substrate" if the key holds them.
curl -sS --fail-with-body -H "$KEY" -H "$JSON" \
  -d '{"analyses": ["vt"]}' \
  "$BASE/v1/cpet/$ID/analyze" | jq '.results[]'

# 4. Derived quantities and input-quality checks.
curl -sS --fail-with-body -H "$KEY" -H "$JSON" \
  -d '{"metrics": ["vo2max", "gas_quality", "sampling_adequacy"]}' \
  "$BASE/v1/cpet/$ID/compute" | jq .metrics

# 5. Delete now rather than waiting for the 24 h expiry.
curl -sS --fail-with-body -X DELETE -H "$KEY" "$BASE/v1/cpet/$ID" | jq .
