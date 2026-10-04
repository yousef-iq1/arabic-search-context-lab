# Architecture Notes — Arabic Search Context Lab

Arabic Search Context Lab is deliberately small. Its purpose is not to imitate a search engine; it demonstrates one developer-relations idea clearly: the same Arabic search intent can produce different structured results when geographic origin, country bias, and Google interface language change.

## Product goal

Help an Arabic-speaking developer understand, by inspection rather than by marketing copy, how SerpApi localization inputs affect search context.

## Why these four markets

- Baghdad — Iraq
- Riyadh — Saudi Arabia
- Cairo — Egypt
- Casablanca — Morocco

They give the demo four distinct Arabic-speaking contexts across the Gulf, Mashriq, and Maghreb without pretending that four cities represent the entire Arabic-speaking world.

## Request model

For every selected market, the server sends the same Arabic query but changes three explicit inputs:

- `location` — simulated geographic origin at city level
- `gl` — Google country bias
- `hl` — Google interface language / locale

The project intentionally keeps the query itself constant. That isolates context as the variable being demonstrated.

## Why server-side only

SerpApi does not support calling the API directly from browser code because that would expose the private API key. The browser therefore calls this Next.js application's own API routes, and only the server communicates with SerpApi. `SERPAPI_KEY` is read from the server environment and is never serialized into client props or source code.

## Why async submission + polling

During product bootcamp testing, a real Baghdad search took roughly 33 seconds end-to-end. Treating every search as instant would create a fragile UX and a long-lived browser request. Live mode therefore submits searches with `async=true`, stores the returned search IDs in the browser, and polls this application's status endpoint, which retrieves completed results through SerpApi's Search Archive flow.

This design also allows individual markets to complete independently. A slow or failed search does not erase successful markets.

## Public snapshot mode

The free SerpApi account has a limited monthly quota. A recruiter opening a portfolio should not consume live searches on every page load. Production therefore defaults to snapshot mode.

Snapshot rules:

1. Every snapshot must come from a real SerpApi response.
2. The original capture timestamp is retained.
3. The UI labels the result as `snapshot` rather than `live`.
4. Fabricated search results are never used.
5. Live mode exists in source and can be enabled server-side for controlled demonstrations.

## Failure model

The app is designed around partial success:

- one market can succeed while another is still processing;
- one market can fail without discarding the rest;
- status polling has a bounded retry window;
- user-facing messages avoid leaking secrets or raw backend errors.

## Scope deliberately excluded

The project does not include authentication, saved searches, billing, social features, a chatbot, arbitrary public free-text search, or analytics dashboards. Those features would expand engineering surface area without strengthening the core evidence this project is meant to provide.

## What this demonstrates in a Developer Advocate application

- practical use of SerpApi rather than superficial name-dropping;
- Arabic/English product thinking and RTL/LTR implementation;
- ability to turn an API behavior into an educational developer experience;
- security awareness around API credentials;
- product feedback: a real latency observation changed the architecture;
- disciplined scope and written technical reasoning.

## Sources used while designing the integration

- SerpApi Google Search API documentation
- SerpApi JavaScript/TypeScript SDK documentation
- SerpApi Search Archive API documentation
- SerpApi guidance on frontend/CORS and API-key handling
