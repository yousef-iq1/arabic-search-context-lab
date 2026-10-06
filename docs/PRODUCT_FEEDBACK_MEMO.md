# Product and Documentation Notes

**Context:** I wrote these notes while building Arabic Search Context Lab with Next.js and TypeScript.

They describe my own experience. They are not a bug report and they do not represent broad customer research.

## Short version

The first request was easy to make in the Playground. The harder parts came after that:

- understanding the difference between `location`, `gl`, and `hl`;
- deciding what to do when a search takes a long time;
- applying the API-key guidance in a current Next.js app.

The docs idea I would test first is one complete example that puts those three topics in the same place.

## 1. location, gl, and hl

### What happened

The three values are documented separately, but at first they can look like different versions of the same setting.

For this project I treated them as:

- `location`: city-level search location;
- `gl`: country bias;
- `hl`: Google interface language and locale.

### What I would try

Add a small example that runs one query in two countries and shows all three values side by side.

An Arabic example would be useful because Arabic is used across many country contexts.

## 2. Async search in TypeScript

### What happened

One Baghdad test took about 33 seconds. `async=true` and Search Archive gave me the pieces I needed, but I still had to decide:

- how often to check;
- when to stop;
- which statuses count as finished;
- what to show if one city finishes before another.

### What I would try

Add a small TypeScript example that submits a search, checks the status with a retry limit, and returns either a result or a clear error.

## 3. Next.js server example

### What happened

The security docs are clear that the API key should not be exposed in browser code.

### What I would try

Add a current App Router example that shows:

- a Route Handler;
- `process.env.SERPAPI_KEY`;
- client code calling only the app's own route;
- optional input validation;
- no secret in `NEXT_PUBLIC_*`.

That would make the server/client boundary easy to copy correctly.

## 4. Country and locale lookup

### What happened

A developer may start with “I need results for Iraq” instead of starting with `hl` or `location`.

### What I would try

Link the country, language, and location lookups more closely from the Google Search API page, or add a tiny country-to-parameter table.

## 5. Public demos and quota

### What happened

A public portfolio can turn every visitor into a live API request.

### What I did here

The public site reads saved SerpApi results, and live mode stays available on the server for testing.

### What I would try

Add a short note for tutorials, portfolios, and hackathon projects about caching or saved results.

## What worked well

- The Playground made the first localized request easy to inspect.
- The response includes enough metadata to check the settings that were used.
- The JavaScript/TypeScript SDK fit cleanly into a Next.js server route.
- Search IDs and Search Archive gave me a workable path for slow searches.
- The security docs are clear about keeping the key off the client.

## What I would check before recommending changes

I would look at support tickets, common developer questions, search timing data, and feedback from more users. My experience is useful input, but it is still one developer's experience.
