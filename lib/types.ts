import type { MarketId } from "./markets";
import type { QueryId } from "./queries";

export type OrganicResult = {
  position: number;
  title: string;
  link: string;
  displayedLink?: string;
  snippet?: string;
  source?: string;
};

export type RelatedQuestion = { question: string };
export type InlineVideo = {
  position: number;
  title: string;
  link: string;
  platform?: string;
  channel?: string;
};

export type MarketSearchResult = {
  marketId: MarketId;
  queryId: QueryId;
  capturedAt: string;
  mode: "live" | "snapshot";
  metadata: {
    searchId?: string;
    status?: string;
    totalTimeTaken?: number;
    googleDomain?: string;
    locationRequested?: string;
    locationUsed?: string;
    hl?: string;
    gl?: string;
    totalResults?: number;
    googleTimeDisplayed?: number;
  };
  organicResults: OrganicResult[];
  relatedQuestions: RelatedQuestion[];
  inlineVideos: InlineVideo[];
};

export type ComparisonSummary = {
  sharedDomains: string[];
  uniqueDomainsByMarket: Partial<Record<MarketId, string[]>>;
};

export type PendingSearch = {
  marketId: MarketId;
  queryId: QueryId;
  searchId: string;
};
