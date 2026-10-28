#!/usr/bin/env bash
# Tell Bing (and the other IndexNow engines) that pages on www.oxynet.net are
# new or changed, so they are fetched now rather than at the next crawl.
#
#   scripts/indexnow.sh                      # every URL in the live sitemap
#   scripts/indexnow.sh /ventilatory-thresholds https://www.oxynet.net/demo
#
# Run it after a deploy that adds or substantially changes a page, not on every
# push: IndexNow asks for significant changes only. Google does not read
# IndexNow; for Google, request indexing in Search Console.
#
# The key is public by design. IndexNow proves ownership by fetching
# /<key>.txt from the site, so the file in public/ must stay deployed and
# match KEY below. A 200 or 202 answer means accepted (202: the key is still
# being validated).
set -euo pipefail

SITE="https://www.oxynet.net"
KEY="1b409840bb393cb886a19730b82a760b"

if [ "$#" -gt 0 ]; then
  urls=()
  for u in "$@"; do
    case "$u" in
      http*) urls+=("$u") ;;
      *) urls+=("$SITE$u") ;;
    esac
  done
else
  urls=()
  while IFS= read -r line; do urls+=("$line"); done \
    < <(curl -fsS "$SITE/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's/<[^>]*>//g')
fi

# The key file must be live before the engines are told to check it.
served=$(curl -fsS "$SITE/$KEY.txt" || true)
if [ "$served" != "$KEY" ]; then
  echo "error: $SITE/$KEY.txt does not serve the key; deploy public/$KEY.txt first" >&2
  exit 1
fi

list=$(printf '"%s",' "${urls[@]}")
body="{\"host\":\"www.oxynet.net\",\"key\":\"$KEY\",\"keyLocation\":\"$SITE/$KEY.txt\",\"urlList\":[${list%,}]}"

printf '%s\n' "${urls[@]}"
code=$(curl -sS -o /dev/null -w '%{http_code}' -X POST "https://api.indexnow.org/indexnow" \
  -H 'Content-Type: application/json; charset=utf-8' -d "$body")
echo "IndexNow answered $code for ${#urls[@]} URL(s)"
case "$code" in 200|202) ;; *) exit 1 ;; esac
