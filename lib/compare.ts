import type { ComparisonSummary, MarketSearchResult } from "./types";

function domainOf(link: string) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function compareMarkets(results: MarketSearchResult[]): ComparisonSummary {
  const sets = results.map((result) =>
    new Set(result.organicResults.map((item) => domainOf(item.link)).filter(Boolean)),
  );
  const sharedDomains = sets.length
    ? [...sets[0]].filter((domain) => sets.every((set) => set.has(domain)))
    : [];

  const uniqueDomainsByMarket: ComparisonSummary["uniqueDomainsByMarket"] = {};
  results.forEach((result, i) => {
    uniqueDomainsByMarket[result.marketId] = [...sets[i]].filter((domain) =>
      sets.every((set, j) => j === i || !set.has(domain)),
    );
  });

  return { sharedDomains, uniqueDomainsByMarket };
}
