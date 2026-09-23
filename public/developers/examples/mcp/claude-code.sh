#!/usr/bin/env bash
# Connect Claude Code to the Oxynet MCP server.
# Keep the key out of shell history: export it first, then run this.
claude mcp add --transport http oxynet https://app.oxynet.net/oxynet-mcp \
  --header "X-API-Key: ${OXYNET_API_KEY:?set OXYNET_API_KEY first}"
