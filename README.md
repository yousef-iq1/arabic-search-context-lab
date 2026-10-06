# Arabic Search Context Lab

I built this project while preparing my application for SerpApi's Arabic Developer Advocate role.

The idea is simple: keep the Arabic query the same, change the local search settings, and compare what comes back. The demo currently uses Baghdad, Riyadh, Cairo, and Casablanca.

It is built with Next.js, TypeScript, and SerpApi.

## Try it

- Demo: https://arabic-search-context-lab-prod.onrender.com
- Why I built it: https://arabic-search-context-lab-prod.onrender.com/proof
- Arabic walkthrough: https://arabic-search-context-lab-prod.onrender.com/walkthrough
- How it is built: https://arabic-search-context-lab-prod.onrender.com/source
- Arabic guide: https://arabic-search-context-lab-prod.onrender.com/guide
- Localization notes: https://arabic-search-context-lab-prod.onrender.com/localization
- Notes from using SerpApi: https://arabic-search-context-lab-prod.onrender.com/feedback
- First 90 days: https://arabic-search-context-lab-prod.onrender.com/plan

This is my own project. I do not work for SerpApi and it is not an official SerpApi product.

## What the demo does

The public version has three Arabic query presets. Each one has a saved result for four cities, so there are 12 real SerpApi captures in the repo.

For every city I keep three settings separate:

- `location`: the city-level search location
- `gl`: the country bias
- `hl`: the Google interface locale

The API key stays on the server.

## Why the public demo uses saved results

I started with live requests. During testing, some searches finished quickly and others took much longer. One Baghdad test took about 33 seconds.

For live mode I use `async=true`, keep the returned search ID, and check Search Archive until the result is ready. Each market is handled separately, so one slow result does not block the others.

For the public site I use saved SerpApi results instead. That keeps the demo reliable and avoids spending API quota every time somebody opens it.

The saved files are here:

```text
data/snapshots/<query-id>/<market-id>.json
```

Every saved result came from a real SerpApi response. The UI shows that it is a saved snapshot and includes the capture time.

## Markets

| City | `location` | `gl` | `hl` |
| --- | --- | --- | --- |
| Baghdad | `Baghdad,Baghdad Governorate,Iraq` | `iq` | `ar-iq` |
| Riyadh | `Riyadh,Riyadh Province,Saudi Arabia` | `sa` | `ar-sa` |
| Cairo | `Cairo,Cairo Governorate,Egypt` | `eg` | `ar-eg` |
| Casablanca | `Casablanca,Casablanca-Settat,Morocco` | `ma` | `ar-ma` |

I checked these location strings against SerpApi's supported locations before capturing the public data.

## Run it locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

For live mode, add your own SerpApi key on the server:

```env
SERPAPI_LIVE_MODE=true
SERPAPI_KEY=your_private_key
```

Do not put the key in browser code.

## Checks

```bash
npm run check
npm run build
```

## Stack

Next.js 16, React 19, TypeScript, SerpApi, and Zod.
