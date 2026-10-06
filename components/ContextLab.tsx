"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MARKETS, MARKET_IDS, type MarketId } from "@/lib/markets";
import { QUERY_PRESETS, type QueryId } from "@/lib/queries";
import type { ComparisonSummary, MarketSearchResult, PendingSearch } from "@/lib/types";

type ApiError = { marketId: MarketId; message: string };
type ApiPayload = {
  state?: "pending" | "complete" | "unavailable";
  results: MarketSearchResult[];
  comparison?: ComparisonSummary;
  jobs?: PendingSearch[];
  pending?: PendingSearch[];
  errors?: ApiError[];
  error?: string;
};

const POLL_INTERVAL_MS = 1800;
const MAX_POLLS = 36;

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7.2h.01" />
    </svg>
  );
}

export function ContextLab() {
  const [locale, setLocale] = useState<"ar" | "en">("ar");
  const [queryId, setQueryId] = useState<QueryId>("ai-tools");
  const [markets, setMarkets] = useState<MarketId[]>(["baghdad", "riyadh", "cairo", "casablanca"]);
  const [payload, setPayload] = useState<ApiPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  const requestVersion = useRef(0);
  const lastScrollY = useRef(0);

  const isAr = locale === "ar";
  const direction = isAr ? "rtl" : "ltr";
  const query = QUERY_PRESETS[queryId];
  const resultByMarket = useMemo(
    () => new Map(payload?.results?.map((result) => [result.marketId, result]) ?? []),
    [payload],
  );

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (currentY < 24) {
        setHeaderHidden(false);
      } else if (delta > 7) {
        setHeaderHidden(true);
      } else if (delta < -7) {
        setHeaderHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function runComparison() {
    const version = ++requestVersion.current;
    setLoading(true);
    setPayload(null);
    setCompletedCount(0);

    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ queryId, markets }),
      });
      const first = (await response.json()) as ApiPayload;
      if (version !== requestVersion.current) return;

      setPayload(first);
      setCompletedCount(first.results?.length ?? 0);

      if (!response.ok || first.state !== "pending" || !first.jobs?.length) {
        setLoading(false);
        return;
      }

      await pollJobs(first.jobs, first.results ?? [], first.errors ?? [], version);
    } catch {
      if (version === requestVersion.current) {
        setPayload({
          results: [],
          error: isAr ? "تعذر الاتصال بالخادم." : "Could not reach the server.",
        });
        setLoading(false);
      }
    }
  }

  async function pollJobs(
    jobs: PendingSearch[],
    initialResults: MarketSearchResult[],
    initialErrors: ApiError[],
    version: number,
  ) {
    let pending = jobs;
    let results = [...initialResults];
    let errors = [...initialErrors];

    for (let attempt = 0; attempt < MAX_POLLS && pending.length; attempt += 1) {
      await delay(POLL_INTERVAL_MS);
      if (version !== requestVersion.current) return;

      const response = await fetch("/api/compare/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ jobs: pending }),
      });

      const next = (await response.json()) as ApiPayload;
      if (!response.ok) throw new Error(next.error || "Could not poll search status.");

      results = mergeResults(results, next.results ?? []);
      errors = mergeErrors(errors, next.errors ?? []);
      pending = next.pending ?? [];

      setPayload({
        state: pending.length ? "pending" : "complete",
        results,
        errors,
        comparison: pending.length ? undefined : buildComparison(results),
      });
      setCompletedCount(results.length + errors.length);
    }

    if (pending.length) {
      const timeoutErrors = pending.map((job) => ({
        marketId: job.marketId,
        message: isAr ? "استغرق البحث وقتًا أطول من المتوقع." : "Search took longer than expected.",
      }));
      errors = mergeErrors(errors, timeoutErrors);
      setPayload({
        state: "complete",
        results,
        errors,
        comparison: buildComparison(results),
      });
    }

    setLoading(false);
  }

  function toggleMarket(id: MarketId) {
    setMarkets((current) =>
      current.includes(id)
        ? current.length > 2
          ? current.filter((x) => x !== id)
          : current
        : [...current, id].slice(0, 4),
    );
  }

  return (
    <main dir={direction} lang={isAr ? "ar" : "en"} className="shell minimalShell">
      <header className={`siteHeader floatingHeader profileLikeHeader ${headerHidden ? "isHidden" : ""}`}>
        <div className="headerInner">
          <Link className="brand brandStrong" href="/">Arabic Search Context Lab</Link>
          <button
            className="lang langCircle"
            onClick={() => setLocale(isAr ? "en" : "ar")}
            aria-label={isAr ? "Switch to English" : "التبديل إلى العربية"}
            title={isAr ? "English" : "العربية"}
          >
            {isAr ? "E" : "ع"}
          </button>
        </div>
      </header>

      <section className="minimalHero heroStage">
        <div className="minimalHeroCopy">
          <h1>{isAr ? "نفس البحث. سياق مختلف." : "Same search. Different context."}</h1>
          <p>
            {isAr
              ? "هذا المشروع يشغّل نفس البحث العربي في بغداد والرياض والقاهرة والدار البيضاء باستخدام SerpApi، ثم يقارن النتائج."
              : "This demo runs the same Arabic search in Baghdad, Riyadh, Cairo, and Casablanca with SerpApi, then compares the results."}
          </p>
          <div className="heroPrimaryActions">
            <Link className="roleProofCta" href="/proof">
              {isAr ? "ليش بنيته" : "Why I built this"}
            </Link>
            <Link className="sourceTextLink" href="/source">
              {isAr ? "كيف بنيته" : "How I built it"}
            </Link>
            <Link className="sourceTextLink walkthroughTextLink" href="/walkthrough">
              {isAr ? "شاهد الفيديو" : "Watch walkthrough"}
            </Link>
          </div>
        </div>

        <div className="heroVisualGroup">
          <div className="contextVisual" aria-hidden="true">
            <span>IQ</span>
            <span>SA</span>
            <span>EG</span>
            <span>MA</span>
            <i>API</i>
          </div>
        </div>
      </section>

      <section className="controlPanel compactControl" id="lab" aria-label={isAr ? "إعداد المقارنة" : "Comparison controls"}>
        <div className="queryControl">
          <div className="querySelectShell">
            <SearchIcon />
            <select
              aria-label={isAr ? "اختر الاستعلام" : "Choose query"}
              value={queryId}
              onChange={(e) => setQueryId(e.target.value as QueryId)}
              disabled={loading}
            >
              {Object.values(QUERY_PRESETS).map((item) => (
                <option key={item.id} value={item.id}>
                  {isAr ? item.ar : item.en}
                </option>
              ))}
            </select>
            <span className="queryChevron" aria-hidden="true">⌄</span>
          </div>
          <button className="run compactRun" disabled={loading} onClick={runComparison}>
            {loading ? (isAr ? "نقارن..." : "Comparing...") : (isAr ? "قارن" : "Compare")}
          </button>
        </div>

        <div className="marketBlock">
          <div className="marketPicker compactMarkets">
            {MARKET_IDS.map((id) => {
              const market = MARKETS[id];
              const active = markets.includes(id);
              return (
                <button
                  key={id}
                  className={active ? "market active" : "market"}
                  onClick={() => toggleMarket(id)}
                  aria-pressed={active}
                  disabled={loading}
                >
                  <strong>{isAr ? market.labelAr : market.labelEn}</strong>
                  <small>{market.gl.toUpperCase()}</small>
                </button>
              );
            })}
          </div>
        </div>

        <div className="controlMeta">
          <span className="snapshotBadge">{isAr ? "12 نتيجة محفوظة من SerpApi" : "12 saved SerpApi results"}</span>
          <details className="miniInfo">
            <summary aria-label={isAr ? "عن وضع البيانات" : "About data mode"} title={isAr ? "عن وضع البيانات" : "About data mode"}>
              <InfoIcon />
            </summary>
            <div>
              {isAr
                ? "الموقع العام يقرأ نتائج SerpApi محفوظة حتى لا يستهلك كل زائر حصة API. المفتاح يبقى على الخادم."
                : "The public site reads saved SerpApi results so each visitor does not spend API quota. The key stays on the server."}
            </div>
          </details>
        </div>

        {loading && (
          <div className="progress" role="status" aria-live="polite">
            <span>{isAr ? `${completedCount}/${markets.length}` : `${completedCount}/${markets.length}`}</span>
            <div className="progressTrack">
              <i style={{ width: `${Math.min(100, (completedCount / markets.length) * 100)}%` }} />
            </div>
          </div>
        )}
      </section>

      {payload?.error && <div className="errorBox">{payload.error}</div>}
      {payload?.errors?.length ? (
        <div className="errorBox">
          {payload.errors.map((item) => (
            <div key={`${item.marketId}-${item.message}`}>
              <strong>{isAr ? MARKETS[item.marketId].labelAr : MARKETS[item.marketId].labelEn}:</strong>{" "}
              {item.message}
            </div>
          ))}
        </div>
      ) : null}

      <section className="grid resultGrid" aria-live="polite">
        {markets.map((id) => (
          <MarketCard
            key={id}
            marketId={id}
            result={resultByMarket.get(id)}
            loading={loading}
            isAr={isAr}
          />
        ))}
      </section>

      {payload?.comparison && (
        <details className="devDrawer">
          <summary>
            <span>
              <CodeIcon />
              {isAr ? "تفاصيل المطور" : "Developer details"}
            </span>
            <small>location / gl / hl</small>
          </summary>
          <div className="devDrawerBody">
            <div className="compareFacts">
              <Fact
                label={isAr ? "نطاقات مشتركة" : "Shared domains"}
                value={payload.comparison.sharedDomains.join(", ") || (isAr ? "لا يوجد" : "None")}
              />
              <Fact label="location" value="geographic origin" />
              <Fact label="gl" value="country bias" />
              <Fact label="hl" value="interface locale" />
            </div>
            <CodeRecipe isAr={isAr} />
          </div>
        </details>
      )}
    </main>
  );
}

function MarketCard({
  marketId,
  result,
  loading,
  isAr,
}: {
  marketId: MarketId;
  result?: MarketSearchResult;
  loading: boolean;
  isAr: boolean;
}) {
  const market = MARKETS[marketId];
  const visibleResults = result?.organicResults.slice(0, 3) ?? [];
  const moreResults = result?.organicResults.slice(3) ?? [];

  return (
    <article className="card resultCard">
      <div className="cardHead compactCardHead">
        <div>
          <h2>{isAr ? market.labelAr : market.labelEn}</h2>
          <p>{isAr ? market.countryAr : market.countryEn}</p>
        </div>
        <span className="pill">{market.gl.toUpperCase()}</span>
      </div>

      {loading && !result ? (
        <div className="skeleton">{isAr ? "بانتظار النتيجة..." : "Waiting..."}</div>
      ) : null}

      {!loading && !result ? (
        <div className="emptyState">
          <span>{market.gl.toUpperCase()}</span>
          <p>{isAr ? "اضغط «قارن» لعرض النتائج." : "Tap Compare to show results."}</p>
        </div>
      ) : null}

      {result ? (
        <>
          <ol className="results compactResults">
            {visibleResults.map((item) => (
              <li key={`${item.position}-${item.link}`}>
                <a href={item.link} target="_blank" rel="noreferrer">{item.title}</a>
                {item.source ? <span>{item.source}</span> : null}
              </li>
            ))}
          </ol>

          {moreResults.length ? (
            <details className="moreResults">
              <summary>{isAr ? `+${moreResults.length} نتائج` : `+${moreResults.length} results`}</summary>
              <ol start={4}>
                {moreResults.map((item) => (
                  <li key={`${item.position}-${item.link}`}>
                    <a href={item.link} target="_blank" rel="noreferrer">{item.title}</a>
                  </li>
                ))}
              </ol>
            </details>
          ) : null}

          <div className="cardUtilities">
            <span>{result.metadata.totalTimeTaken ? `${result.metadata.totalTimeTaken}s` : result.mode}</span>
            <details className="miniInfo">
              <summary aria-label={isAr ? "بيانات اللقطة" : "Snapshot data"} title={isAr ? "بيانات اللقطة" : "Snapshot data"}>
                <InfoIcon />
              </summary>
              <div className="cardPopover">
                <strong>{isAr ? "نتيجة محفوظة من SerpApi" : "Saved SerpApi result"}</strong>
                <span>{formatCapturedAt(result.capturedAt, isAr ? "ar-IQ" : "en")}</span>
                <span>{result.metadata.hl ?? market.hl} / {result.metadata.gl ?? market.gl}</span>
              </div>
            </details>
          </div>

          <details className="dataDetails">
            <summary>{isAr ? "البيانات" : "Data"}</summary>
            <pre>
              {JSON.stringify(
                {
                  marketId,
                  mode: result.mode,
                  capturedAt: result.capturedAt,
                  metadata: result.metadata,
                  organicResults: result.organicResults,
                  relatedQuestions: result.relatedQuestions,
                },
                null,
                2,
              )}
            </pre>
          </details>
        </>
      ) : null}
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="fact">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function CodeRecipe({ isAr }: { isAr: boolean }) {
  const code = `import { getJson } from "serpapi";

const result = await getJson({
  engine: "google",
  api_key: process.env.SERPAPI_KEY!,
  q: "أفضل أدوات الذكاء الاصطناعي للمبرمجين",
  location: "Baghdad,Baghdad Governorate,Iraq",
  gl: "iq",
  hl: "ar-iq",
});`;

  return (
    <div className="codeBlock">
      <p>{isAr ? "مثال خادمي آمن" : "Safe server-side recipe"}</p>
      <pre dir="ltr">{code}</pre>
    </div>
  );
}

function mergeResults(current: MarketSearchResult[], incoming: MarketSearchResult[]) {
  const map = new Map(current.map((item) => [item.marketId, item]));
  incoming.forEach((item) => map.set(item.marketId, item));
  return [...map.values()];
}

function mergeErrors(current: ApiError[], incoming: ApiError[]) {
  const map = new Map(current.map((item) => [item.marketId, item]));
  incoming.forEach((item) => map.set(item.marketId, item));
  return [...map.values()];
}

function buildComparison(results: MarketSearchResult[]): ComparisonSummary | undefined {
  if (results.length < 2) return undefined;

  const domains = results.map(
    (result) =>
      new Set(result.organicResults.map((item) => safeDomain(item.link)).filter(Boolean)),
  );

  const sharedDomains = [...domains[0]].filter((domain) =>
    domains.every((set) => set.has(domain)),
  );

  const uniqueDomainsByMarket: ComparisonSummary["uniqueDomainsByMarket"] = {};
  results.forEach((result, i) => {
    uniqueDomainsByMarket[result.marketId] = [...domains[i]].filter((domain) =>
      domains.every((set, j) => j === i || !set.has(domain)),
    );
  });

  return { sharedDomains, uniqueDomainsByMarket };
}

function safeDomain(link: string) {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function formatCapturedAt(value: string, locale: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
