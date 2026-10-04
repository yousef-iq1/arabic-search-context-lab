import "server-only";
import { getJson, getJsonBySearchId } from "serpapi";
import { MARKETS, type MarketId } from "./markets";
import { QUERY_PRESETS, type QueryId } from "./queries";
import { normalizeSerpResponse } from "./normalize";
import type { MarketSearchResult, PendingSearch } from "./types";

export type SearchStatus =
  | { state: "pending"; job: PendingSearch; status: string }
  | { state: "complete"; result: MarketSearchResult }
  | { state: "error"; job: PendingSearch; message: string };

export function liveModeEnabled() {
  return process.env.SERPAPI_LIVE_MODE === "true";
}

export async function startMarketSearch(
  marketId: MarketId,
  queryId: QueryId,
): Promise<SearchStatus> {
  const apiKey = requireApiKey();
  const market = MARKETS[marketId];
  const query = QUERY_PRESETS[queryId];

  const response = (await getJson({
    engine: "google",
    api_key: apiKey,
    async: true,
    q: query.ar,
    location: market.location,
    gl: market.gl,
    hl: market.hl,
    device: "desktop",
  })) as Record<string, any>;

  const id = response.search_metadata?.id;
  const status = String(response.search_metadata?.status ?? "Queued");
  if (!id) throw new Error(`SerpApi did not return a search ID for ${marketId}.`);

  const job: PendingSearch = { marketId, queryId, searchId: String(id) };
  if (status === "Success") {
    return { state: "complete", result: normalizeSerpResponse(response, marketId, queryId) };
  }
  if (isErrorStatus(status) || response.error) {
    return { state: "error", job, message: safeApiMessage(response.error) };
  }
  return { state: "pending", job, status };
}

export async function readMarketSearch(job: PendingSearch): Promise<SearchStatus> {
  const apiKey = requireApiKey();
  const response = (await getJsonBySearchId(job.searchId, { api_key: apiKey })) as Record<
    string,
    any
  >;
  const status = String(response.search_metadata?.status ?? "Processing");

  if (status === "Success") {
    return {
      state: "complete",
      result: normalizeSerpResponse(response, job.marketId, job.queryId),
    };
  }
  if (isErrorStatus(status) || response.error) {
    return { state: "error", job, message: safeApiMessage(response.error) };
  }
  return { state: "pending", job, status };
}

function requireApiKey() {
  if (!liveModeEnabled()) throw new Error("Live SerpApi mode is disabled for this deployment.");
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) throw new Error("SERPAPI_KEY is not configured on the server.");
  return apiKey;
}

function isErrorStatus(status: string) {
  return !["Queued", "Processing", "Success"].includes(status);
}

function safeApiMessage(value: unknown) {
  return typeof value === "string" && value.trim() ? value : "SerpApi returned an error.";
}
