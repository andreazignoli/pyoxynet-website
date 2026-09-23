"""
Oxynet quick start: upload a CPET export, analyse it, read the result.

    pip install requests
    export OXYNET_API_KEY=sk_live_...
    python quickstart.py oxynet_sample.json

Works on any supported vendor export, sent unchanged: do not convert units or
rename columns first. Reference: https://www.oxynet.net/developers/api/v1
"""

import os
import sys

import requests

BASE = "https://app.oxynet.net"

session = requests.Session()
session.headers["X-API-Key"] = os.environ["OXYNET_API_KEY"]


def call(method, path, **kwargs):
    r = session.request(method, BASE + path, timeout=120, **kwargs)
    if not r.ok:
        # Every error has the same shape: {"error": CODE, "message": ..., "context": {...}}
        err = r.json()
        sys.exit(f"{r.status_code} {err['error']}: {err['message']}\n{err.get('context')}")
    return r.json()


def main(path):
    # 1. What this key may do. Analyses are licensed separately, so ask first.
    caps = call("GET", "/v1/capabilities")
    print("analyses on this key:", caps["analyses"])

    # 2. Upload the file exactly as exported. The format is detected from its content.
    with open(path, "rb") as f:
        rec = call("POST", "/v1/cpet", files={"file": (os.path.basename(path), f)})
    cpet_id = rec["cpet_id"]
    print("cpet_id:", cpet_id, "| format:", rec["source"]["format"])
    for name, ch in rec["channels"].items():
        if not ch.get("present"):
            print(f"  {name} absent: {ch.get('reason', 'not in this export')}")

    # 3. Analyse. One envelope per analysis; one that cannot run does not stop the others.
    wanted = [a for a in ("vt", "eov", "substrate") if a in caps["analyses"]]
    out = call("POST", f"/v1/cpet/{cpet_id}/analyze", json={"analyses": wanted})
    for env in out["results"]:
        print(f"\n[{env['analysis']}] status: {env['status']}")
        if env["status"] != "ok":
            # A refusal is information: it says what was missing and why.
            print("  refused:", env["error"], "-", env["message"])
            continue
        # `quality` describes the RECORDING. It is not a confidence in the answer.
        print("  quality of the input:", env["quality"])
        if env["analysis"] == "vt":
            print("  findings:", env["findings"])
        else:
            print("  finding fields:", ", ".join(sorted(env["findings"])))
        for note in env["notes"]:
            print("  note:", note)  # caveats that must travel with the numbers
        print("  provenance:", env["provenance"])

    # 4. Derived quantities and input checks, cheaper than a full analysis.
    m = call("POST", f"/v1/cpet/{cpet_id}/compute",
             json={"metrics": ["vo2max", "gas_quality", "sampling_adequacy"]})
    for name, res in m["metrics"].items():
        print(f"\n[{name}]", res["value"] if res["status"] == "ok" else res)

    # 5. Delete now rather than waiting for the 24 h expiry.
    call("DELETE", f"/v1/cpet/{cpet_id}")
    print("\ndeleted", cpet_id)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "oxynet_sample.json")
