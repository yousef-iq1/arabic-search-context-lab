import { NextResponse } from "next/server";
import { z } from "zod";
import { compareMarkets } from "@/lib/compare";
import { MARKET_IDS } from "@/lib/markets";
import { QUERY_IDS } from "@/lib/queries";
import { readMarketSearch } from "@/lib/serpapi";
import type { MarketSearchResult, PendingSearch } from "@/lib/types";

const jobSchema = z.object({
  marketId: z.enum(MARKET_IDS),
  queryId: z.enum(QUERY_IDS),
  searchId: z.string().regex(/^[a-zA-Z0-9_-]{8,80}$/),
});

const requestSchema = z.object({ jobs: z.array(jobSchema).min(1).max(4) });

export async function POST(request: Request) {
  try {
    const { jobs } = requestSchema.parse(await request.json());
    const settled = await Promise.allSettled(jobs.map((job) => readMarketSearch(job)));
    const results: MarketSearchResult[] = [];
    const pending: PendingSearch[] = [];
    const errors: { marketId: string; message: string }[] = [];

    settled.forEach((item, index) => {
      const job = jobs[index];
      if (item.status === "rejected") {
        errors.push({ marketId: job.marketId, message: "Could not read this search yet." });
        return;
      }
      if (item.value.state === "complete") results.push(item.value.result);
      if (item.value.state === "pending") pending.push(item.value.job);
      if (item.value.state === "error") {
        errors.push({ marketId: job.marketId, message: item.value.message });
      }
    });

    return NextResponse.json({
      state: pending.length ? "pending" : "complete",
      results,
      pending,
      errors,
      comparison: pending.length ? undefined : compareMarkets(results),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid search status request." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not retrieve search status." }, { status: 500 });
  }
}
