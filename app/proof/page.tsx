import Link from "next/link";

const walkthroughUrl = "https://trading-v.hoaster.page/yousef-serpapi-arabic-walkthrough";

const items = [
  { title: "Arabic technical walkthrough", type: "Speaking", status: "Recorded · 1:29", text: "A real Arabic-voice walkthrough of the product, localization inputs, and the engineering decisions behind the demo.", href: "/walkthrough" },
  { title: "Public GitHub repository", type: "Source", status: "Public", text: "Standalone source with setup, architecture notes, real snapshots, and the server-side SerpApi integration.", href: "https://github.com/yousef-iq1/arabic-search-context-lab" },
  { title: "Public source tour", type: "Engineering", status: "Published", text: "A focused walkthrough of localization inputs, secret handling, async search, partial failure, and public snapshot design.", href: "/source" },
  { title: "Arabic documentation localization", type: "Localization", status: "Published", text: "A parameter-level Arabic sample covering location, country bias, locale, async search, caching, and output formats.", href: "/localization" },
  { title: "Arabic Search Context Lab", type: "Product", status: "12 real snapshots", text: "Three curated Arabic intents across Baghdad, Riyadh, Cairo, and Casablanca using explicit localization parameters.", href: "/" },
  { title: "Arabic technical tutorial", type: "Education", status: "Published", text: "Arabic guidance for location/gl, hl, server-side keys, async search, Search Archive polling, and quota-safe demos.", href: "/guide" },
  { title: "Product & documentation feedback", type: "Feedback", status: "Published", text: "First-hand friction and documentation opportunities separated from hypotheses that need broader validation.", href: "/feedback" },
  { title: "Arabic market 30/60/90 plan", type: "Strategy", status: "Published", text: "A measured plan for developer education, community learning, partnerships, feedback, and qualified adoption.", href: "/plan" },
];

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6M12 7.2h.01" />
    </svg>
  );
}

export default function ProofPage() {
  return (
    <main className="shell proofMinimalShell" dir="ltr" lang="en">
      <header className="subpageHeader portfolioHeader">
        <div className="subpageHeaderInner">
          <Link className="brand brandStrong" href="/">Arabic Search Context Lab</Link>
          <Link className="subpageAction compactHeaderAction" href="/">Demo</Link>
        </div>
      </header>

      <section className="proofLead proofLeadCompact">
        <div className="proofTitleRow">
          <h1>Proof of fit.</h1>
          <details className="miniInfo proofTruthInfo">
            <summary aria-label="Truth boundary" title="Truth boundary"><InfoIcon /></summary>
            <div>
              Independent project. No SerpApi affiliation, borrowed title, or invented community work.
            </div>
          </details>
        </div>
        <p>Product. Engineering. Arabic content. Localization. Market strategy.</p>
      </section>

      <section className="evidenceGrid">
        {items.map((item) => (
          <article className="evidenceCard" key={item.title}>
            <div className="evidenceMeta">
              <span>{item.type}</span>
              <span>{item.status}</span>
            </div>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
            {item.href.startsWith("/") ? (
              <Link className="evidenceLink" href={item.href}>Open <span>↗</span></Link>
            ) : (
              <a className="evidenceLink" href={item.href} target="_blank" rel="noreferrer">Open <span>↗</span></a>
            )}
          </article>
        ))}

        <article className="evidenceCard">
          <div className="evidenceMeta">
            <span>Speaking</span>
            <span>Recorded</span>
          </div>
          <h2>Arabic walkthrough</h2>
          <p>A concise human-recorded technical walkthrough of the project, localization behavior, implementation details, and role-fit proof.</p>
          <a className="evidenceLink" href={walkthroughUrl} target="_blank" rel="noreferrer">Watch walkthrough <span>↗</span></a>
          <video
            className="proofVideo"
            controls
            preload="metadata"
            playsInline
            src={walkthroughUrl}
            style={{ width: "100%", marginTop: "18px", borderRadius: "14px", display: "block" }}
          />
        </article>
      </section>
    </main>
  );
}
