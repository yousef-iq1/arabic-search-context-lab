# Snapshot data

The public demo is intended to run from clearly labeled, real SerpApi captures so it does not burn through a free-tier API quota.

Snapshot files are written as:

```
data/snapshots/<query-id>/<market-id>.json
```

Each file contains the normalized `MarketSearchResult` shape from `lib/types.ts` and must be captured from a real search. Do not fabricate results. A snapshot should keep its original `capturedAt` timestamp and is displayed as `snapshot` mode in the UI.

Live mode is enabled only when the server environment includes both:

```
SERPAPI_LIVE_MODE=true
SERPAPI_KEY=<private key>
```

The key is never committed or sent to the browser.

## Controlled capture workflow

The repository includes `scripts/capture-snapshots.mjs`. It is disabled by default.

For a one-time trusted capture, set `SERPAPI_CAPTURE_ON_BUILD=true` alongside the private server-side `SERPAPI_KEY`. The controlled capture step can submit one or more curated Arabic query presets for Baghdad, Riyadh, Cairo, and Casablanca, waits for Search Archive completion, normalizes the responses, and prints each snapshot between explicit log markers. `SERPAPI_CAPTURE_QUERY_IDS` and `SERPAPI_CAPTURE_MARKETS` can narrow a trusted capture run. The API key is never printed.

After the normalized log output is reviewed and committed here, return `SERPAPI_CAPTURE_ON_BUILD` to `false`.

This is intentionally a maintainer-only capture workflow rather than a public endpoint, so public visitors cannot consume the account quota.
