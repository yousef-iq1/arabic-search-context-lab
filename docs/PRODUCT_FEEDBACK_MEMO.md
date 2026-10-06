# Notes from building with SerpApi

These notes come from building Arabic Search Context Lab with Next.js and TypeScript. They are based on my own experience, not broad customer research.

## The first request was straightforward

The Playground made it easy to get a working request. Most of my questions came after that, when I had to separate local search settings, handle a slow request, and decide how the browser should talk to the server safely.

## location, gl, and hl make more sense when shown together

I understood each parameter from the docs, but I still had to think carefully about how they differ:

- `location`: the geographic origin I want to simulate
- `gl`: the country bias
- `hl`: the Google interface locale

A small example showing the same query in two countries would make the difference easier to see for a new developer.

## Async search needs one complete example

A Baghdad request took about 33 seconds during testing. That pushed me toward `async=true` and Search Archive.

The SDK gives the pieces, but I still had to decide how often to check, when to stop, how to handle errors, and what to show when only some markets are ready.

A compact TypeScript example that covers submit, wait, retry, success, and error would be useful.

## A current Next.js server example would save time

The security guidance is clear that the API key should not live in browser code.

A current App Router example could show:

- a Route Handler
- `process.env.SERPAPI_KEY`
- a client request to the Route Handler
- optional input validation

That would connect the security rule to a stack many frontend developers already use.

## Finding local settings could be easier from a market name

I started with questions like "what should I use for Iraq?" rather than "where is the hl table?"

A small market example near the localization docs could shorten that path.

## Public demos and quota

A public demo can spend a live API request every time somebody visits.

For this project I used saved real results on the public site and kept live mode available on the server for controlled tests.

A short note about that pattern could help people publishing tutorials, hackathon projects, or portfolio demos.

## What worked well for me

- The Playground was quick to use.
- The response metadata made the search settings easy to verify.
- The JavaScript/TypeScript SDK worked well in a Next.js server route.
- Search IDs and Search Archive solved the slow-search problem.
- The security docs are clear about keeping keys out of browser code.

If I were working inside the team, I would compare these notes with support questions and other developer feedback before treating any of them as a priority.
