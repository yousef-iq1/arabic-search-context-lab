import { getJson, getJsonBySearchId } from "serpapi";

const enabled = process.env.SERPAPI_CAPTURE_ON_BUILD === "true";
if (!enabled) {
  console.log("[snapshot-capture] skipped (SERPAPI_CAPTURE_ON_BUILD != true)");
  process.exit(0);
}

const apiKey = process.env.SERPAPI_KEY;
if (!apiKey) {
  console.error("[snapshot-capture] SERPAPI_CAPTURE_ON_BUILD=true but SERPAPI_KEY is missing");
  process.exit(1);
}

const queries = {
  "ai-tools": {
    id: "ai-tools",
    q: "أفضل أدوات الذكاء الاصطناعي للمبرمجين",
  },
  "learn-nextjs": {
    id: "learn-nextjs",
    q: "تعلم Next.js بالعربي",
  },
  "arabic-programming": {
    id: "arabic-programming",
    q: "أفضل مصادر تعلم البرمجة بالعربي",
  },
};

const requestedQueryIds = (process.env.SERPAPI_CAPTURE_QUERY_IDS ?? "ai-tools")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const selectedQueries = requestedQueryIds.map((id) => queries[id]).filter(Boolean);
if (selectedQueries.length !== requestedQueryIds.length) {
  console.error("[snapshot-capture] SERPAPI_CAPTURE_QUERY_IDS includes an unknown query id");
  process.exit(1);
}

const markets = [
  { id: "baghdad", location: "Baghdad,Baghdad Governorate,Iraq", gl: "iq", hl: "ar-iq" },
  { id: "riyadh", location: "Riyadh,Riyadh Province,Saudi Arabia", gl: "sa", hl: "ar-sa" },
  { id: "cairo", location: "Cairo,Cairo Governorate,Egypt", gl: "eg", hl: "ar-eg" },
  { id: "casablanca", location: "Casablanca,Casablanca-Settat,Morocco", gl: "ma", hl: "ar-ma" },
];

const requestedMarketIds = (process.env.SERPAPI_CAPTURE_MARKETS ?? "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean);

const selectedMarkets = requestedMarketIds.length
  ? markets.filter((market) => requestedMarketIds.includes(market.id))
  : markets;

if (requestedMarketIds.length && selectedMarkets.length !== requestedMarketIds.length) {
  console.error("[snapshot-capture] SERPAPI_CAPTURE_MARKETS includes an unknown market id");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function numberOrUndefined(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function normalize(response, market, query) {
  const metadata = response.search_metadata ?? {};
  const params = response.search_parameters ?? {};
  const info = response.search_information ?? {};

  return {
    marketId: market.id,
    queryId: query.id,
    capturedAt: new Date().toISOString(),
    mode: "snapshot",
    metadata: {
      searchId: metadata.id ? String(metadata.id) : undefined,
      status: metadata.status ? String(metadata.status) : undefined,
      totalTimeTaken: numberOrUndefined(metadata.total_time_taken),
      googleDomain: params.google_domain ? String(params.google_domain) : undefined,
      locationRequested: params.location_requested ? String(params.location_requested) : undefined,
      locationUsed: params.location_used ? String(params.location_used) : undefined,
      hl: params.hl ? String(params.hl) : undefined,
      gl: params.gl ? String(params.gl) : undefined,
      totalResults: numberOrUndefined(info.total_results),
      googleTimeDisplayed: numberOrUndefined(info.time_taken_displayed),
    },
    organicResults: Array.isArray(response.organic_results)
      ? response.organic_results.slice(0, 5).map((item) => ({
          position: Number(item.position ?? 0),
          title: String(item.title ?? ""),
          link: String(item.link ?? ""),
          displayedLink: item.displayed_link ? String(item.displayed_link) : undefined,
          snippet: item.snippet ? String(item.snippet) : undefined,
          source: item.source ? String(item.source) : undefined,
        }))
      : [],
    relatedQuestions: Array.isArray(response.related_questions)
      ? response.related_questions.slice(0, 5).map((item) => ({ question: String(item.question ?? "") }))
      : [],
    inlineVideos: Array.isArray(response.inline_videos)
      ? response.inline_videos.slice(0, 4).map((item) => ({
          position: Number(item.position ?? 0),
          title: String(item.title ?? ""),
          link: String(item.link ?? ""),
          platform: item.platform ? String(item.platform) : undefined,
          channel: item.channel ? String(item.channel) : undefined,
        }))
      : [],
  };
}

async function capture(market, query) {
  const submitted = await getJson({
    engine: "google",
    api_key: apiKey,
    async: true,
    q: query.q,
    location: market.location,
    gl: market.gl,
    hl: market.hl,
    device: "desktop",
  });

  const searchId = submitted?.search_metadata?.id;
  if (!searchId) throw new Error(`${query.id}/${market.id}: no search id returned`);

  let response = submitted;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const status = String(response?.search_metadata?.status ?? "Processing");
    if (status === "Success") return normalize(response, market, query);
    if (response?.error || !["Queued", "Processing"].includes(status)) {
      throw new Error(`${query.id}/${market.id}: ${response?.error ?? status}`);
    }
    await sleep(2000);
    response = await getJsonBySearchId(String(searchId), { api_key: apiKey });
  }

  throw new Error(`${query.id}/${market.id}: timed out waiting for Search Archive result`);
}

const jobs = selectedQueries.flatMap((query) =>
  selectedMarkets.map((market) => ({ query, market })),
);

console.log(
  `[snapshot-capture] starting ${jobs.length} controlled real searches: ${selectedQueries
    .map((q) => q.id)
    .join(", ")} × ${selectedMarkets.map((m) => m.id).join(", ")}`,
);

const settled = await Promise.allSettled(jobs.map(({ query, market }) => capture(market, query)));
let failures = 0;

for (let i = 0; i < settled.length; i += 1) {
  const { query, market } = jobs[i];
  const result = settled[i];

  if (result.status === "fulfilled") {
    console.log(`SERPAPI_SNAPSHOT_BEGIN ${query.id} ${market.id}`);
    console.log(JSON.stringify(result.value));
    console.log(`SERPAPI_SNAPSHOT_END ${query.id} ${market.id}`);
  } else {
    failures += 1;
    console.error(
      `[snapshot-capture] ${query.id}/${market.id} failed: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`,
    );
  }
}

console.log(`[snapshot-capture] finished: ${jobs.length - failures}/${jobs.length} succeeded`);
if (failures) {
  console.warn("[snapshot-capture] partial capture; build will continue so logs can be inspected.");
}
