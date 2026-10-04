import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { MarketId } from "./markets";
import type { QueryId } from "./queries";
import type { MarketSearchResult } from "./types";

export async function getSnapshot(
  marketId: MarketId,
  queryId: QueryId,
): Promise<MarketSearchResult | null> {
  const file = path.join(process.cwd(), "data", "snapshots", queryId, `${marketId}.json`);
  try {
    const parsed = JSON.parse(await readFile(file, "utf8")) as MarketSearchResult;
    return { ...parsed, mode: "snapshot" };
  } catch (error: any) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}
