# Oxynet examples

Everything here runs against the hosted API at https://app.oxynet.net (API v1).
Full documentation: https://www.oxynet.net/developers

```
examples/
  python/quickstart.py        upload, analyse, compute, delete (requests)
  rest/quickstart.sh          the same flow with curl and jq
  mcp/claude-code.sh          connect Claude Code to the MCP server
  mcp/gemini-settings.json    connect Gemini CLI to the MCP server
samples/
  oxynet_sample.json              synthetic incremental test
  oxynet_sample_oscillating.json  synthetic test with a 60 s oscillation
```

## Before you start

- **A key.** Every call except `/v1/sample`, `/v1/openapi.json` and `/health`
  needs an `X-API-Key` header. Keys are issued by Oxynet on request:
  https://www.oxynet.net/developers/quickstart#access
- **No key yet?** You can still fetch the synthetic sample and the schema:

  ```sh
  curl -s https://app.oxynet.net/v1/sample | jq '{filename, note, expected}'
  curl -s https://app.oxynet.net/v1/openapi.json | jq '.paths | keys'
  ```

## The samples are synthetic

Both files are the output of `GET /v1/sample` (and `?oscillating=true`),
saved as Oxynet canonical JSON. They are generated, not recorded: no person,
no patient. The thresholds sit near 55 % and 80 % of the exercise period
**because the generator placed them there**. They show that the pipeline works;
they are not validation data and say nothing about accuracy.

## Your own files

Send the vendor export unchanged. Remove names and dates of birth from the
file and the filename first: Oxynet needs no identifiers.
