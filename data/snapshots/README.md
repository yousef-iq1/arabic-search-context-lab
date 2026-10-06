# Saved SerpApi results

The public demo uses saved SerpApi results so opening the site does not spend a live API request every time.

Files live here:

```text
data/snapshots/<query-id>/<market-id>.json
```

Each file uses the `MarketSearchResult` shape from `lib/types.ts`.

A saved result must come from a real SerpApi response. Keep its original `capturedAt` value. Do not add made-up search results.

## Live mode

Live mode needs both values on the server:

```env
SERPAPI_LIVE_MODE=true
SERPAPI_KEY=<private key>
```

The key is not committed to the repo and is not sent to the browser.

## Capturing new saved results

The repo includes `scripts/capture-snapshots.mjs`. It is off by default.

For a controlled capture:

1. Set `SERPAPI_CAPTURE_ON_BUILD=true`.
2. Keep `SERPAPI_KEY` in the server environment.
3. Use `SERPAPI_CAPTURE_QUERY_IDS` or `SERPAPI_CAPTURE_MARKETS` if you only need part of the matrix.
4. Review the captured output.
5. Commit the saved JSON files.
6. Set `SERPAPI_CAPTURE_ON_BUILD=false` again.

The capture script does not print the API key.

I keep this as a build-time/admin workflow instead of exposing a public capture button, because public visitors should not be able to spend the API quota.
