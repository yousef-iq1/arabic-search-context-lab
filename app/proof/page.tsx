import Link from "next/link";

const items = [
  { title: "Arabic technical walkthrough", type: "Video", status: "1:29", text: "A short Arabic walkthrough of the demo, the localization settings, and the main engineering choices.", href: "/walkthrough" },
  { title: "Public GitHub repository", type: "Code", status: "Public", text: "Source code, setup notes, saved search results, and the SerpApi integration.", href: "https://github.com/yousef-iq1/arabic-search-context-lab" },
  { title: "How the project is built", type: "Engineering", status: "Page", text: "Server-side key handling, localization settings, async search, per-city result handling, and saved results.", href: "/source" },
  { title: "Arabic localization sample", type: "Localization", status: "Page", text: "A small Arabic docs sample for location, gl, hl, async search, cache, and output formats.", href: "/localization" },
  { title: "Arabic Search Context Lab", type: "Project", status: "12 captures", text: "Three Arabic searches across Baghdad, Riyadh, Cairo, and Casablanca.", href: "/" },
  { title: "Arabic technical guide", type: "Writing", status: "Page", text: "Arabic notes on location, gl, hl, server-side keys, async search, Search Archive, and the public demo setup.", href: "/guide" },
  { title: "Product and docs notes", type: "Feedback", status: "Page", text: "What was easy, where I got stuck, and a few changes I would check with more developers.", href: "/feedback" },
  { title: "Arabic market 30/60/90 plan", type: "Plan", status: "Page", text: "A practical first-90-days plan for developer content, community work, feedback, and growth.", href: "/plan" },
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
          <h1>Work I did for this role.</h1>
          <details className="miniInfo proofTruthInfo">
            <summary aria-label="About this project" title="About this project"><InfoIcon /></summary>
            <div>
              I built this independently. I do not work for SerpApi, and SerpApi did not ask me to build it.
            </div>
          </details>
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
            {item.href.startsWith("/") ? (
              <Link className="evidenceLink" href={item.href}>Open <span>↗</span></Link>
            ) : (
              <a className="evidenceLink" href={item.href} target="_blank" rel="noreferrer">Open <span>↗</span></a>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
