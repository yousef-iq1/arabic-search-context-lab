import type { MarketId } from "./markets";
import type { QueryId } from "./queries";
import type { MarketSearchResult } from "./types";

type SerpApiResponse = Record<string, any>;

export function normalizeSerpResponse(
  response: SerpApiResponse,
  marketId: MarketId,
  queryId: QueryId,
  mode: "live" | "snapshot" = "live",
): MarketSearchResult {
  const meta = response.search_metadata ?? {};
  const params = response.search_parameters ?? {};
  const info = response.search_information ?? {};

  return {
    marketId,
    queryId,
    capturedAt: new Date().toISOString(),
    mode,
    metadata: {
      searchId: stringOrUndefined(meta.id),
      status: stringOrUndefined(meta.status),
      totalTimeTaken: numberOrUndefined(meta.total_time_taken),
      googleDomain: stringOrUndefined(params.google_domain),
      locationRequested: stringOrUndefined(params.location_requested),
      locationUsed: stringOrUndefined(params.location_used),
      hl: stringOrUndefined(params.hl),
      gl: stringOrUndefined(params.gl),
      totalResults: numberOrUndefined(info.total_results),
      googleTimeDisplayed: numberOrUndefined(info.time_taken_displayed),
    },
    organicResults: Array.isArray(response.organic_results)
      ? response.organic_results.slice(0, 5).map((item: any) => ({
          position: Number(item.position ?? 0),
          title: String(item.title ?? ""),
          link: String(item.link ?? ""),
          displayedLink: item.displayed_link ? String(item.displayed_link) : undefined,
          snippet: item.snippet ? String(item.snippet) : undefined,
          source: item.source ? String(item.source) : undefined,
        }))
      : [],
    relatedQuestions: Array.isArray(response.related_questions)
      ? response.related_questions.slice(0, 5).map((item: any) => ({
          question: String(item.question ?? ""),
        }))
      : [],
    inlineVideos: Array.isArray(response.inline_videos)
      ? response.inline_videos.slice(0, 4).map((item: any) => ({
          position: Number(item.position ?? 0),
          title: String(item.title ?? ""),
          link: String(item.link ?? ""),
          platform: item.platform ? String(item.platform) : undefined,
          channel: item.channel ? String(item.channel) : undefined,
        }))
      : [],
  };
}

function numberOrUndefined(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function stringOrUndefined(value: unknown) {
  return typeof value === "string" && value.length ? value : undefined;
}
