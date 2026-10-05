import { readFile } from "node:fs/promises";
import path from "node:path";

const queryIds = ["ai-tools", "learn-nextjs", "arabic-programming"];
const marketIds = ["baghdad", "riyadh", "cairo", "casablanca"];

let failures = 0;

for (const queryId of queryIds) {
  for (const marketId of marketIds) {
    const file = path.join(process.cwd(), "data", "snapshots", queryId, `${marketId}.json`);
    try {
      const parsed = JSON.parse(await readFile(file, "utf8"));
      const valid =
        parsed?.queryId === queryId &&
        parsed?.marketId === marketId &&
        parsed?.mode === "snapshot" &&
        parsed?.metadata?.status === "Success" &&
        Array.isArray(parsed?.organicResults) &&
        parsed.organicResults.length > 0;

      if (!valid) {
        failures += 1;
        console.error(`[snapshot-validate] invalid: ${queryId}/${marketId}`);
      }
    } catch (error) {
      failures += 1;
      console.error(
        `[snapshot-validate] missing/unreadable: ${queryId}/${marketId}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}

if (failures) {
  console.error(`[snapshot-validate] failed: ${failures} snapshot(s) invalid or missing`);
  process.exit(1);
}

console.log("[snapshot-validate] 12/12 real snapshot files present and structurally valid");
