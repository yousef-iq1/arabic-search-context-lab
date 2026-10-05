"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { MARKETS, MARKET_IDS, type MarketId } from "@/lib/markets";
import { QUERY_PRESETS, type QueryId } from "@/lib/queries";
import type { ComparisonSummary, MarketSearchResult, PendingSearch } from "@/lib/types";

type ApiError = { marketId: MarketId; message: string };
type ApiPayload = { state?: "pending" | "complete" | "unavailable"; results: MarketSearchResult[]; comparison?: ComparisonSummary; jobs?: PendingSearch[]; pending?: PendingSearch[]; errors?: ApiError[]; error?: string; };
const POLL_INTERVAL_MS = 1800;
const MAX_POLLS = 36;

export function ContextLab() {
  const [locale, setLocale] = useState<"ar" | "en">("ar");
  const [queryId, setQueryId] = useState<QueryId>("ai-tools");
  const [markets, setMarkets] = useState<MarketId[]>(["baghdad", "riyadh", "cairo", "casablanca"]);
  const [payload, setPayload] = useState<ApiPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const requestVersion = useRef(0);
  const isAr = locale === "ar";
  const direction = isAr ? "rtl" : "ltr";
  const query = QUERY_PRESETS[queryId];
  const resultByMarket = useMemo(() => new Map(payload?.results?.map((result) => [result.marketId, result]) ?? []), [payload]);

  async function runComparison() {
    const version = ++requestVersion.current; setLoading(true); setPayload(null); setCompletedCount(0);
    try {
      const response = await fetch("/api/compare", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ queryId, markets }) });
      const first = (await response.json()) as ApiPayload; if (version !== requestVersion.current) return;
      setPayload(first); setCompletedCount(first.results?.length ?? 0);
      if (!response.ok || first.state !== "pending" || !first.jobs?.length) { setLoading(false); return; }
      await pollJobs(first.jobs, first.results ?? [], first.errors ?? [], version);
    } catch { if (version === requestVersion.current) { setPayload({ results: [], error: isAr ? "تعذر الاتصال بالخادم." : "Could not reach the server." }); setLoading(false); } }
  }

  async function pollJobs(jobs: PendingSearch[], initialResults: MarketSearchResult[], initialErrors: ApiError[], version: number) {
    let pending = jobs; let results = [...initialResults]; let errors = [...initialErrors];
    for (let attempt = 0; attempt < MAX_POLLS && pending.length; attempt += 1) {
      await delay(POLL_INTERVAL_MS); if (version !== requestVersion.current) return;
      const response = await fetch("/api/compare/status", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jobs: pending }) });
      const next = (await response.json()) as ApiPayload; if (!response.ok) throw new Error(next.error || "Could not poll search status.");
      results = mergeResults(results, next.results ?? []); errors = mergeErrors(errors, next.errors ?? []); pending = next.pending ?? [];
      setPayload({ state: pending.length ? "pending" : "complete", results, errors, comparison: pending.length ? undefined : buildComparison(results) });
      setCompletedCount(results.length + errors.length);
    }
    if (pending.length) { const timeoutErrors = pending.map((job) => ({ marketId: job.marketId, message: isAr ? "استغرق البحث وقتًا أطول مم المتوقع." : "Search took longer than expected." })); errors = mergeErrors(errors, timeoutErrors); setPayload({ state: "complete", results, errors, comparison: buildComparison(results) }); }
    setLoading(false);
  }

  function toggleMarket(id: MarketId) { setMarkets((current) => current.includes(id) ? current.length > 2 ? current.filter((x) => x !== id) : current : [...current, id].slice(0, 4)); }

  return (
    <main dir={direction} lang={isAr ? "ar" : "en"} className="shell">
      <header className="siteHeader">
        <Link className="brand" href="/">Arabic Search Context Lab</Link>
        <nav className="heroActions" aria-label={isAr ? "روابط المشروع" : "Project links"}>
          <Link className="textLink" href="/proof">{isAr ? "ملف الإثبات" : "Proof"}</Link>
          <Link className="textLink" href="/source">{isAr ? "المصدر" : "Source"}</Link>
          <button className="lang" onClick={() => setLocale(isAr ? "en" : "ar")}>{isAr ? "EN" : "عربي"}</button>
        </nav>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">{isAr ? "مشروع مستقل مبني باستخدام SerpApi" : "Independent project built with SerpApi"}</p>
          <h1>{isAr ? "بيانات البحث للمطورين، مو صفحات بحث للمستخدمين." : "Search data for software — not search pages for people."}</h1>
          <p className="lede">{isAr
            ? "SerpApi تحوّل نتائج محركات البحث إلى بيانات منظّمة يستطيع التطبيق أو الـAI agent استخدامها مباشرة، بينما تتولى هي تعقيد الـscraping والـCAPTCHA والـproxies وتغيّر الصفحات."
            : "SerpApi turns search-engine surfaces into structured data that applications and AI agents can use directly, while handling scraping complexity, CAPTCHAs, proxies, and changing layouts."}</p>
          <div className="heroCtas">
            <a className="primaryCta" href="#lab">{isAr ? "شاهد التجربة" : "Open the experiment"}</a>
            <Link className="secondaryCta" href="/proof">{isAr ? "لماذا هذا يثبت ملاءمتي للدور" : "Why this is role evidence"}</Link>
          </div>
        </div>
        <aside className="heroProof">
          <span className="miniLabel">{isAr ? "هذا المشروع يثبت جزءًا واحدًا فقط" : "This project proves one slice"}</span>
          <strong>{isAr ? "Localization لسياق البحث العربي" : "Arabic search-context localization"}</strong>
          <p>{isAr
            ? "نفس الاستعلام، أربع مدن، ومعلمات location وgl وhl واضحة. الهدف مو تمثيل كل منتج SerpApi — بل إظهار استخدام حقيقي للـAPI وتحويله إلى شرح تقني قابل للفحص."
            : "Same intent, four cities, explicit location/gl/hl inputs. It is not a clone of SerpApi; it is inspectable evidence of real API use, localization thinking, and developer education."}</p>
        </aside>
      </section>

      <section className="productStrip" aria-label={isAr ? "أمثلة على استخدام SerpApi" : "SerpApi use cases"}>
        <div><span>01</span><strong>{isAr ? "AI وAgents" : "AI & agents"}</strong><p>{isAr ? "بحث حي وبيانات ويب منظّمة للأنظمة الذكية." : "Fresh web/search data for AI systems."}</p></div>
        <div><span>02</span><strong>{isAr ? "خرائط ووظائف وتسوق" : "Maps, jobs & shopping"}</strong><p>{isAr ? "واجهات بحث جاهزة بدل بناء scraper وصيانته." : "Structured search surfaces without maintaining scrapers."}</p></div>
        <div><span>03</span><strong>{isAr ? "سفر وSEO وبحث" : "Travel, SEO & research"}</strong><p>{isAr ? "Flights وHotels وNews وTrends وغيرها ضمن منظومة واحدة." : "Flights, hotels, news, trends, and more in one API ecosystem."}</p></div>
      </section>

      <section className="experimentIntro" id="lab">
        <p className="eyebrow">{isAr ? "التجربة" : "The experiment"}</p>
        <h2>{isAr ? "نفس السؤال العربي. أربع سياقات محلية." : "Same Arabic question. Four local contexts."}</h2>
        <p>{isAr
          ? "هنا أعزل المتغيرات بدل ما أغيّر السؤال: الموقع الجغرافي، انحياز الدولة، ولغة واجهة Google. النتائج المعروضة لقطات حقيقية محفوظة من SerpApi حتى تكون التجربة العامة قابلة للفحص بدون استهلاك API لكل زائر."
          : "The query stays fixed while geographic origin, country bias, and Google locale change. The public experience uses real saved SerpApi captures so anyone can inspect the behavior without spending API quota per visitor."}</p>
      </section>

      <section className="controlPanel" aria-label={isAr ? "إعداد المقارنة" : "Comparison controls"}>
        <label><span>{isAr ? "الاستعلام" : "Query"}</span><select value={queryId} onChange={(e) => setQueryId(e.target.value as QueryId)} disabled={loading}>{Object.values(QUERY_PRESETS).map((item) => (<option key={item.id} value={item.id}>{isAr ? item.ar : item.en}</option>))}</select></label>
        <div><span className="label">{isAr ? "الأسواق" : "Markets"}</span><div className="marketPicker">{MARKET_IDS.map((id) => { const market = MARKETS[id]; const active = markets.includes(id); return (<button key={id} className={active ? "market active" : "market"} onClick={() => toggleMarket(id)} aria-pressed={active} disabled={loading}><strong>{isAr ? market.labelAr : market.labelEn}</strong><small>{isAr ? market.countryAr : market.countryEn}</small></button>); })}</div></div>
        <button className="run" disabled={loading} onClick={runComparison}>{loading ? (isAr ? "نجري المقارنة…" : "Comparing…") : (isAr ? "قارن السياقات" : "Compare contexts")}</button>
        {loading && (<div className="progress" role="status" aria-live="polite"><span>{isAr ? `اكتمل ${completedCount} من ${markets.length}` : `${completedCount} of ${markets.length} complete`}</span><div className="progressTrack"><i style={{ width: `${Math.min(100, (completedCount / markets.length) * 100)}%` }} /></div></div>)}
        <p className="note">{isAr ? "النسخة العامة تستخدم لقطات حقيقية محفوظة لحماية حصة الـAPI. وضع البحث الحي يستخدم إرسالًا غير متزامنًا، والمفتاح يبقى على الخادم فقط." : "The public demo uses clearly labeled real snapshots to protect API quota. Live mode submits searches asynchronously, and the API key stays server-side only."}</p>
      </section>
      <section className="queryBanner"><span>{isAr ? "الاستعلام العربي المستخدم" : "Arabic intent being compared"}</span><strong lang="ar" dir="rtl">{query.ar}</strong></section>
      {payload?.error && <div className="errorBox">{payload.error}</div>}
      {payload?.errors?.length ? (<div className="errorBox">{payload.errors.map((item) => (<div key={`${item.marketId}-${item.message}`}><strong>{isAr ? MARKETS[item.marketId].labelAr : MARKETS[item.marketId].labelEn}:</strong> {item.message}</div>))}</div>) : null}
      <section className="grid" aria-live="polite">{markets.map((id) => (<MarketCard key={id} marketId={id} result={resultByMarket.get(id)} loading={loading} isAr={isAr} />))}</section>
      {payload?.comparison && (<section className="inspector"><div><p className="eyebrow">Developer Inspector</p><h2>{isAr ? "ماذا تغيّر بين الأسواق؟" : "What changed across markets?"}</h2><p>{isAr ? "لا نتعامل مع «العربية» كسياق بحث واحد. الموقع والانحياز للدولة ولغة واجهة Google متغيرات مستقلة ويمكن أن تغيّر النتائج." : "Arabic is not one search context. Geographic origin, country bias, and Google interface language are separate inputs that can change what comes back."}</p></div><div className="compareFacts"><Fact label={isAr ? "نطاقات مشتركة" : "Shared domains"} value={payload.comparison.sharedDomains.join(", ") || "—"} /><Fact label="location" value="simulates geographic origin" /><Fact label="gl" value="country bias" /><Fact label="hl" value="Google interface language" /></div><CodeRecipe isAr={isAr} /></section>)}
    </main>
  );
}

function MarketCard({ marketId, result, loading, isAr }: { marketId: MarketId; result?: MarketSearchResult; loading: boolean; isAr: boolean }) {
  const market = MARKETS[marketId];
  return (<article className="card"><div className="cardHead"><div><h2>{isAr ? market.labelAr : market.labelEn}</h2><p>{isAr ? market.countryAr : market.countryEn}</p></div><span className="pill">{market.gl.toUpperCase()}</span></div>{loading && !result ? <div className="skeleton">{isAr ? "بانتظار النتيجة…" : "Waiting for result…"}</div> : null}{!loading && !result ? <p className="muted">{isAr ? "شغّل المقارنة لعرض بيانات هذا السوق." : "Run the comparison to inspect this market."}</p> : null}{result ? (<><div className="metaRow"><span>{result.mode}</span><span>{result.metadata.googleDomain ?? "—"}</span><span>{result.metadata.totalTimeTaken ? `${result.metadata.totalTimeTaken}s` : "—"}</span><span>{result.metadata.hl ?? market.hl}</span></div>{result.mode === "snapshot" && (<p className="snapshotStamp">{isAr ? "لقطة حقيقية محفوظة:" : "Saved real capture:"} {formatCapturedAt(result.capturedAt, isAr ? "ar-IQ" : "en")}</p>)}<ol className="results">{result.organicResults.map((item) => (<li key={`${item.position}-${item.link}`}><a href={item.link} target="_blank" rel="noreferrer">{item.title}</a>{item.snippet && <p>{item.snippet}</p>}</li>))}</ol>{result.relatedQuestions.length > 0 && (<details><summary>{isAr ? "أسئلة مرتبطة" : "Related questions"}</summary><ul>{result.relatedQuestions.map((item) => <li key={item.question}>{item.question}</li>)}</ul></details>)}<details><summary>JSON / parameters</summary><pre>{JSON.stringify({ marketId, mode: result.mode, capturedAt: result.capturedAt, ...result.metadata }, null, 2)}</pre></details></>) : null}</article>);
}
function Fact({ label, value }: { label: string; value: string }) { return <div className="fact"><span>{label}</span><strong>{value}</strong></div>; }
function CodeRecipe({ isAr }: { isAr: boolean }) { const code = `import { getJson } from "serpapi";\n\nconst result = await getJson({\n  engine: "google",\n  api_key: process.env.SERPAPI_KEY!,\n  q: "أفضل أدوات الذكاء الاصطناعي للمبرمجين",\n  location: "Baghdad,Baghdad Governorate,Iraq",\n  gl: "iq",\n  hl: "ar-iq",\n});`; return <div className="codeBlock"><p>{isAr ? "مثال آمن على الخادم" : "Safe server-side recipe"}</p><pre dir="ltr">{code}</pre></div>; }
function mergeResults(current: MarketSearchResult[], incoming: MarketSearchResult[]) { const map = new Map(current.map((item) => [item.marketId, item])); incoming.forEach((item) => map.set(item.marketId, item)); return [...map.values()]; }
function mergeErrors(current: ApiError[], incoming: ApiError[]) { const map = new Map(current.map((item) => [item.marketId, item])); incoming.forEach((item) => map.set(item.marketId, item)); return [...map.values()]; }
function buildComparison(results: MarketSearchResult[]): ComparisonSummary | undefined { if (results.length < 2) return undefined; const domains = results.map((result) => new Set(result.organicResults.map((item) => safeDomain(item.link)).filter(Boolean))); const sharedDomains = [...domains[0]].filter((domain) => domains.every((set) => set.has(domain))); const uniqueDomainsByMarket: ComparisonSummary["uniqueDomainsByMarket"] = {}; results.forEach((result, i) => { uniqueDomainsByMarket[result.marketId] = [...domains[i]].filter((domain) => domains.every((set, j) => j === i || !set.has(domain))); }); return { sharedDomains, uniqueDomainsByMarket }; }
function safeDomain(link: string) { try { return new URL(link).hostname.replace(/^www\./, ""); } catch { return ""; } }
function formatCapturedAt(value: string, locale: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(date); }
function delay(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }
