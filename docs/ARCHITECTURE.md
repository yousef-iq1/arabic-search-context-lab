# Architecture notes

I kept Arabic Search Context Lab small on purpose. The project compares one Arabic search across four cities and makes the local search settings visible.

## What changes between markets

The query stays the same. For each city I change:

- `location`: city-level search location
- `gl`: country bias
- `hl`: Google interface locale

The four cities are Baghdad, Riyadh, Cairo, and Casablanca. They are examples for the demo, not a claim that four cities represent every Arabic-speaking market.

## Why the API key stays on the server

The browser calls my Next.js API route. The server reads `SERPAPI_KEY` from its environment and sends the request to SerpApi.

I do not put the key in client code or `NEXT_PUBLIC_*` variables.

## Why live mode is asynchronous

One Baghdad test took about 33 seconds. After that, I stopped treating every search as something that would finish during one short browser request.

Live mode starts a search with `async=true`, keeps the returned search ID, and checks Search Archive until it finishes.

Each market is handled separately. If one city is slow or fails, the completed cities can still be shown.

## Why the public site uses saved results

I did not want a recruiter opening the site to spend live API requests.

The public version therefore uses saved SerpApi results.

Rules I used:

1. Every saved result must come from a real SerpApi response.
2. Keep the capture time.
3. Label it as saved data in the UI.
4. Do not invent search results.
5. Keep live mode available for controlled testing.

## What I left out

There is no login, billing, chatbot, social layer, or general-purpose search box. Those features would make the project larger without helping explain the part I wanted to show.
