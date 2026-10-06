# Arabic Search Context Lab

This is a small SerpApi project I built while applying for the Developer Advocate (Arabic) role.

It runs the same Arabic search in four cities:

- Baghdad, Iraq
- Riyadh, Saudi Arabia
- Cairo, Egypt
- Casablanca, Morocco

The query stays the same. The project changes `location`, `gl`, and `hl` so the differences are easier to inspect.

Built with **Next.js, TypeScript, and SerpApi**.

> I built this project independently. I do not work for SerpApi, and SerpApi did not ask me to build it.

## Project links

- Demo: https://arabic-search-context-lab-prod.onrender.com
- Work for this application: https://arabic-search-context-lab-prod.onrender.com/proof
- Arabic walkthrough: https://arabic-search-context-lab-prod.onrender.com/walkthrough
- Arabic technical guide: https://arabic-search-context-lab-prod.onrender.com/guide
- Arabic localization sample: https://arabic-search-context-lab-prod.onrender.com/localization
- Product and docs notes: https://arabic-search-context-lab-prod.onrender.com/feedback
- 30/60/90 plan: https://arabic-search-context-lab-prod.onrender.com/plan
- Build notes: https://arabic-search-context-lab-prod.onrender.com/source

The public demo currently has **12 saved SerpApi captures**: three Arabic queries in four cities. The public site reads those saved results so opening the portfolio does not spend API quota.

## What the demo does

- Sends the same Arabic query with different `location`, `gl`, and `hl` values
- Compares organic results across four cities
- Uses Arabic and English layouts with RTL/LTR support
- Keeps the SerpApi key on the server
- Supports `async=true` and Search Archive polling in live mode
- Lets each city finish or fail separately
- Shows when each saved result was captured
- Includes the TypeScript request pattern used by the project

## Why live mode uses async search

One Baghdad test took about 33 seconds. I did not want one slow city to hold the whole browser request open, so live mode submits the search with `async=true`, keeps the search ID, and checks Search Archive until each result is ready or the retry limit is reached.

## Saved results and live mode

Production uses saved results by default.

Live mode can be enabled on the server with:

```env
SERPAPI_LIVE_MODE=true
SERPAPI_KEY=your_private_key
```

The key never goes into browser code or the repository.

Saved files live here:

```text
data/snapshots/<query-id>/<market-id>.json
```

Every saved file came from a SerpApi response. I did not create fake search results.

The first four-city capture reported these SerpApi times:

- Baghdad: 44.87s
- Riyadh: 81.56s
- Cairo: 0.49s
- Casablanca: 203.97s

Those numbers are from that capture only. They are not general latency claims.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without saved results, use live mode locally with your own SerpApi key.

## Checks

```bash
npm run check
npm run build
```

## Stack

- Next.js 16
- React 19
- TypeScript
- SerpApi JavaScript/TypeScript SDK
- Zod

## Search settings

| City | `location` | `gl` | `hl` |
| --- | --- | --- | --- |
| Baghdad | `Baghdad,Baghdad Governorate,Iraq` | `iq` | `ar-iq` |
| Riyadh | `Riyadh,Riyadh Province,Saudi Arabia` | `sa` | `ar-sa` |
| Cairo | `Cairo,Cairo Governorate,Egypt` | `eg` | `ar-eg` |
| Casablanca | `Casablanca,Casablanca-Settat,Morocco` | `ma` | `ar-ma` |

## What I left out

There are no accounts, billing, chatbot features, social features, or open-ended public search. The project is intentionally small so the search-context comparison stays easy to understand.
