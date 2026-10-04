import { NextResponse } from "next/server";
import { z } from "zod";
import { compareMarkets } from "@/lib/compare";
import { MARKET_IDS } from "@/lib/markets";
import { QUERY_IDS } from "@/lib/queries";
import { getSnapshot } from "@/lib/snapshots";
import { liveModeEnabled, startMarketSearch } from "@/lib/serpapi";
import type { MarketSearchResult, PendingSearch } from "@/lib/types";

const requestSchema = z.object({
  queryId: z.enum(QUERY_IDS),
  markets: z.array(z.enum(MARKET_IDS)).min(2).max(4),
});

export async function POST(request: Request) {
  try {
    const body = requestSchema.parse(await request.json());

    if (!liveModeEnabled()) {
      const snapshots = await Promise.all(
        body.markets.map((marketId) => getSnapshot(marketId, body.queryId)),
      );
      const results = snapshots.filter(Boolean) as MarketSearchResult[];
      const missing = body.markets.filter((_, index) => !snapshots[index]);

      if (missing.length) {
        return NextResponse.json(
          {
            state: "unavailable",
            results,
            error: `Snapshot data is not seeded for: ${missing.join(", ")}.`,
          },
          { status: 503 },
        );
      }

      return NextResponse.json({
        state: "complete",
        results,
        errors: [],
        comparison: compareMarkets(results),
      });
    }

    const settled = await Promise.allSettled(
      body.markets.map((marketId) => startMarketSearch(marketId, body.queryId)),
    );

    const results: MarketSearchResult[] = [];
    const jobs: PendingSearch[] = [];
    const errors: { marketId: string; message: string }[] = [];

    settled.forEach((item, index) => {
      const marketId = body.markets[index];
      if (item.status === "rejected") {
        errors.push({ marketId, message: safeError(item.reason) });
        return;
      }
      if (item.value.state === "complete") results.push(item.value.result);
      if (item.value.state === "pending") jobs.push(item.value.job);
      if (item.value.state === "error") {
        errors.push({ marketId, message: item.value.message });
      }
    });

    if (!jobs.length) {
      return NextResponse.json({
        state: "complete",
        results,
        errors,
        comparison: compareMarkets(results),
      });
    }

    return NextResponse.json({ state: "pending", results, jobs, errors });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid comparison request." }, { status: 400 });
    }
    return NextResponse.json({ error: safeError(error) }, { status: 500 });
  }
}

function safeError(error: unknown) {
  if (error instanceof Error) {
    if (/SERPAPI_KEY/i.test(error.message)) return "Live search is not configured.";
    if (/disabled/i.test(error.message)) return error.message;
  }
  return "The search could not be completed. Try again later.";
}
