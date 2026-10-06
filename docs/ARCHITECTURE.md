# Architecture Notes: Arabic Search Context Lab

Arabic Search Context Lab is a small project with one main job: run the same Arabic search in several cities while keeping the location settings easy to inspect.

## Cities

- Baghdad, Iraq
- Riyadh, Saudi Arabia
- Cairo, Egypt
- Casablanca, Morocco

I chose four different Arabic-speaking cities for the demo. They are examples, not a claim that four cities represent the whole Arabic-speaking region.

## Request settings

The text of the query stays the same. The server changes three values for each city:

- `location`: city-level search location
- `gl`: Google country bias
- `hl`: Google interface language and locale

Keeping those values separate makes it easier to see which part of the request changed.

## API key

The SerpApi key stays on the server. The browser calls this Next.js app, and the server calls SerpApi. `SERPAPI_KEY` comes from the server environment and is never sent to client code.

## Slow searches

One Baghdad test took about 33 seconds. That was long enough to change the live-search flow.

Live mode submits with `async=true`, receives a search ID, and then checks Search Archive through the app's status route. Each city is handled separately, so a slow or failed city does not remove results that already finished.

## Public site

The public site uses saved SerpApi results because I do not want every portfolio visit to spend API quota.

Rules for saved results:

1. Each file must come from a SerpApi response.
2. Keep the capture time.
3. Label the result as saved, not live.
4. Do not create fake search results.
5. Keep live mode available on the server for testing.

## Errors and retries

Each city keeps its own status. The polling loop stops after a fixed retry limit, and the UI shows a city-specific error instead of exposing raw backend details.

## What I left out

The project does not have accounts, billing, saved searches, chat features, social features, or open-ended public search. Those features would make the app larger without helping the comparison.

## Why this project is in my application

It gave me a way to use SerpApi before applying, write down what I learned, and show both the code and the explanation. The parts most relevant to the role are:

- using the API in a working project;
- explaining localization in Arabic and English;
- keeping credentials on the server;
- changing the design after seeing a slow request;
- writing product/docs notes after using the product;
- keeping the scope small enough to explain clearly.

## References

- SerpApi Google Search API documentation
- SerpApi JavaScript/TypeScript SDK documentation
- SerpApi Search Archive API documentation
- SerpApi frontend/CORS and API-key guidance
