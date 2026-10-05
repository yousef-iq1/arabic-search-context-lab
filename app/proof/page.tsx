import Link from "next/link";

const items = [
  { title: "Public GitHub repository", type: "Source", status: "Public", text: "Standalone source with setup, architecture notes, real snapshots, and the server-side SerpApi integration.", href: "https://github.com/yousef-iq1/arabic-search-context-lab" },
  { title: "Public source tour", type: "Engineering", status: "Published", text: "A focused walkthrough of localization inputs, secret handling, async search, partial failure, and public snapshot design.", href: "/source" },
  { title: "Arabic documentation localization", type: "Localization", status: "Published", text: "A parameter-level Arabic sample covering location, country bias, locale, async search, caching, and output formats.", href: "/localization" },
  { title: "Arabic Search Context Lab", type: "Product", status: "12 real snapshots", text: "Three curated Arabic intents across Baghdad, Riyadh, Cairo, and Casablanca using explicit localization parameters.", href: "/" },
  { title: "Arabic technical tutorial", type: "Education", status: "Published", text: "Arabic guidance for location/gl/hl, server-side keys, async search, Search Archive polling, and quota-safe demos.", href: "/guide" },
  { title: "Product & documentation feedback", type: "Feedback", status: "Published", text: "First-hand friction and documentation opportunities separated from hypotheses that need broader validation.", href: "/feedback" },
  { title: "Arabic market 30/60/90 plan", type: "Strategy", status: "Published", text: "A measured plan for developer education, community learning, partnerships, feedback, and qualified adoption.", href: "/plan" },
  { title: "Arabic walkthrough", type: "Speaking", status: "Pending", text: "A concise technical walkthrough will be published only after the real human recording is complete.", href: null },
];

export default function ProofPage() {
  return (
    <main className="shell proofMinimalShell" dir="ltr" lang="en">
      <header className="subpageHeader">
        <Link className="brand brandStrong" href="/">Arabic Search Context Lab</Link>
        <Link className="subpageAction" href="/">Open demo</Link>
      </header>

      <section className="proofLead">
        <p className="proofKicker">Independent pre-application proof</p>
        <h1>Why this proves I fit the role.</h1>
        <p>
          Real product use, Arabic technical content, localization judgment, product feedback,
          and a market plan — all inspectable.
        </p>
        <div className="proofStats" aria-label="Proof summary">
          <span><strong>12</strong> real snapshots</span>
          <span><strong>Public</strong> source</span>
          <span><strong>Arabic</strong> technical content</span>
        </div>
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
            {item.href ? (
              item.href.startsWith("/") ? (
                <Link className="evidenceLink" href={item.href}>Open <span>↗</span></Link>
              ) : (
                <a className="evidenceLink" href={item.href} target="_blank" rel="noreferrer">Open <span>↗</span></a>
              )
            ) : (
              <span className="evidencePending">Pending human recording</span>
            )}
          </article>
        ))}
      </section>

      <section className="proofCallout">
        <div>
          <span>What changed because I used the product</span>
          <strong>A real slow search changed the architecture.</strong>
        </div>
        <p>
          Live mode moved to async submission + Search Archive polling with bounded retries
          and per-market completion. Public mode uses real saved captures instead of spending API quota per visitor.
        </p>
        <Link href="/source">See the implementation →</Link>
      </section>

      <footer className="truthLine">
        Independent project. No SerpApi affiliation, borrowed title, or invented community work.
      </footer>
    </main>
  );
}
