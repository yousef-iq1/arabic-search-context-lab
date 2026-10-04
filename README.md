# Arabic Search Context Lab

**Same Arabic query. Different local context.**

Arabic Search Context Lab is an independent developer demo built to explore how the same Arabic search intent can produce different structured Google results when the geographic origin, country bias, and Google interface language change across Arab markets.

It is built with **Next.js, TypeScript, and SerpApi** and currently compares four city-level contexts:

- Baghdad, Iraq
- Riyadh, Saudi Arabia
- Cairo, Egypt
- Casablanca, Morocco

> This is an independent project built with SerpApi. It is not an official SerpApi product and does not imply endorsement by SerpApi.

## Live proof surfaces

- Demo: https://arabic-search-context-lab-1yn1.onrender.com
- Proof index: https://arabic-search-context-lab-1yn1.onrender.com/proof
- Arabic technical guide: https://arabic-search-context-lab-1yn1.onrender.com/guide
- Localization sample: https://arabic-search-context-lab-1yn1.onrender.com/localization
- Product/docs feedback: https://arabic-search-context-lab-1yn1.onrender.com/feedback
- 30/60/90 plan: https://arabic-search-context-lab-1yn1.onrender.com/plan
- Public source tour: https://arabic-search-context-lab-1yn1.onrender.com/source

**Current launch gate:** the application-facing public comparison is waiting for one controlled four-market real-snapshot capture. The application should not be submitted until those snapshots are seeded and final interaction QA passes.

## What it demonstrates

- Real Arabic search localization with `location`, `gl`, and `hl`
- Structured comparison of organic results and related questions
- Arabic/English UI with RTL/LTR behavior
- Server-side API-key protection
- Non-blocking SerpApi searches using `async=true` + Search Archive polling
- Partial-result and failure handling across multiple markets
- Clearly labeled real snapshots for a quota-safe public demo
- A developer inspector that explains the parameters and shows a safe TypeScript recipe

## Why async search matters

During product bootcamp testing, one real Baghdad search took roughly 33 seconds end-to-end. The app therefore does not assume searches are instant. In live mode it submits searches asynchronously, returns search IDs quickly, and polls the Search Archive API while the interface shows progress and any completed markets.

## Public mode vs live mode

The intended public deployment uses **real saved snapshots** from controlled SerpApi captures so a recruiter can explore the comparison without exhausting a free API quota.

Live mode is available in the source and can be enabled server-side with:

```env
SERPAPI_LIVE_MODE=true
SERPAPI_KEY=your_private_key
```

The private key is never exposed to browser code or committed to the repository.

Snapshot files live at:

```text
data/snapshots/<query-id>/<market-id>.json
```

Snapshots must come from real SerpApi responses; fabricated search data is not used.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without seeded snapshots, use live mode locally with a private SerpApi key. After real captures are saved, turn live mode off to test the public snapshot experience.

## Quality checks

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

## Security and quota decisions

- `SERPAPI_KEY` exists only in the server environment.
- The browser only calls this application's own server routes.
- The public demo uses curated query presets rather than arbitrary public free-text search.
- Snapshot mode is the default for production.
- Live searches are submitted asynchronously and completed through Search Archive polling.

## Search contexts

| Market | `location` | `gl` | `hl` |
| --- | --- | --- | --- |
| Baghdad | `Baghdad,Baghdad Governorate,Iraq` | `iq` | `ar-iq` |
| Riyadh | `Riyadh,Riyadh Province,Saudi Arabia` | `sa` | `ar-sa` |
| Cairo | `Cairo,Cairo Governorate,Egypt` | `eg` | `ar-eg` |
| Casablanca | `Casablanca,Casablanca-Settat,Morocco` | `ma` | `ar-ma` |

## Scope discipline

This project intentionally does **not** include accounts, a chatbot, saved searches, social features, billing, arbitrary public queries, or a generic search-engine clone. Its job is to teach one thing clearly: Arabic-speaking markets are not one search context, and search localization should be treated as an explicit engineering decision.
