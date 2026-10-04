# Product & Documentation Feedback Memo

**Context:** observations from building Arabic Search Context Lab as a new SerpApi user with Next.js + TypeScript.

**Intent:** this is not a bug report and it does not claim to represent broad customer research. It separates first-hand observations from hypotheses that would need user validation.

## Executive summary

The core API was straightforward to discover and the Playground made the first successful request easy. The main friction appeared after the first request: understanding localization as three separate controls, designing around a slow search, and translating SerpApi's secure server-side guidance into a modern Next.js application pattern.

The highest-value documentation opportunity I see is an opinionated guide for localized, browser-facing apps: city-level `location` + `gl` + `hl`, server-side secret handling, and async search retrieval in one end-to-end example.

## 1. Localization mental model

### Observation

`location`, `gl`, and `hl` are individually documented, but a new developer can still read them as overlapping variants of the same idea.

In the Arabic-market experiment, I needed to reason about them separately:

- `location` = simulated geographic origin;
- `gl` = country bias;
- `hl` = Google interface language / locale.

### Why this matters

For a regional product, choosing only an Arabic `hl` value is not the same as choosing an Iraqi, Saudi, Egyptian, or Moroccan search context. This distinction is easy to miss if the developer starts from a language requirement rather than from search infrastructure.

### Suggestion

Add a small “localized search recipe” to Google Search API docs with one query shown across two countries, explicitly explaining why all three inputs exist.

An Arabic example would be particularly useful because one language spans many country contexts.

## 2. Async search ergonomics

### Observation

A real Baghdad request during testing took roughly 33 seconds end-to-end. The documented `async=true` + Search Archive pattern solved the architecture problem well.

### Friction

The JavaScript SDK gives the primitives (`getJson`, search ID, `getJsonBySearchId`), but the developer still has to design retry cadence, terminal states, timeout behavior, and partial UI states.

### Suggestion

Add a compact TypeScript helper/example for:

1. submit;
2. poll with bounded retries/backoff;
3. distinguish `Queued`, `Processing`, `Success`, and error;
4. return a typed result.

This would be especially useful for browser-facing products where keeping one HTTP request open is undesirable.

## 3. Modern Next.js server-side example

### Observation

SerpApi's CORS guidance correctly prevents browser-side API-key exposure, and the security guide clearly recommends environment variables.

### Opportunity

A current Next.js App Router example would connect those two pieces for a large JavaScript audience:

- Route Handler;
- `process.env.SERPAPI_KEY`;
- client calls only the first-party route;
- optional Zod validation;
- no key in `NEXT_PUBLIC_*` variables.

### Why it matters

Many frontend-oriented developers understand “don't expose the key” but still benefit from seeing the correct modern framework boundary implemented once.

## 4. Locale discoverability

### Observation

Values such as `ar-iq`, `ar-sa`, `ar-eg`, and `ar-ma` work for the language parameter, and city-level locations are available for Baghdad, Riyadh, Cairo, and Casablanca.

### Opportunity

For developers who begin with a market name (“Iraq” or “Saudi Arabia”) rather than a parameter name (`hl`), the supported locale/location discovery path could be easier to find from the main Google Search API page.

### Suggestion

Cross-link location and locale lookup more prominently from the localization parameter descriptions, or provide a tiny market-to-parameter example table.

## 5. Public demos and quota safety

### Observation

A public portfolio/demo can unintentionally turn every visitor into a paid/live API request.

### Pattern used in this project

The public version is designed to show timestamped real snapshots while keeping live mode available server-side for controlled demos.

### Possible documentation addition

A short “building a public demo” note could mention caching and saved/example results, especially for free-tier developers who want to publish tutorials or hackathon projects without burning quota.

## What worked well

- Playground made the first localized search easy to inspect.
- Structured JSON exposed enough metadata to verify what context was actually used.
- The official JavaScript/TypeScript SDK fit naturally into a Next.js server runtime.
- Search IDs + archive retrieval gave a clean solution for slower requests.
- Security guidance is explicit that keys do not belong in browser code.

## What I would validate before treating these as roadmap priorities

This memo is based on one developer's build experience. Before changing product/docs, I would check:

- support tickets mentioning confusion between `location`, `gl`, and `hl`;
- how often frontend/Next.js/CORS questions appear;
- how many searches have latency high enough that developers benefit from async examples;
- whether regional Developer Advocates hear similar localization questions;
- whether hackathon/demo users report quota surprises.

That validation step matters: first-hand friction is useful input, but it is not automatically representative user research.
