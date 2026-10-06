import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Project Notes | Arabic Search Context Lab",
  description:
    "The project, code, Arabic guide, localization notes, API/docs feedback, and walkthrough behind Arabic Search Context Lab.",
  openGraph: {
    title: "Arabic Search Context Lab",
    description:
      "A SerpApi project comparing the same Arabic search across Baghdad, Riyadh, Cairo and Casablanca.",
    url: "https://arabic-search-context-lab-prod.onrender.com/proof",
    images: ["/walkthrough-poster.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Arabic Search Context Lab",
    description:
      "A SerpApi project comparing the same Arabic search across four cities.",
    images: ["/walkthrough-poster.jpg"],
  },
};

const items = [
  { title: "Arabic technical walkthrough", type: "Video", status: "1:29", text: "I recorded a short Arabic walkthrough of the demo, the localization settings, and the main engineering choices.", href: "/walkthrough" },
  { title: "Public GitHub repository", type: "Code", status: "Public", text: "The full project is public, including setup notes, saved results, and the server-side SerpApi integration.", href: "https://github.com/yousef-iq1/arabic-search-context-lab" },
  { title: "How it is built", type: "Code", status: "Published", text: "A short look at how I handled localization, the API key, async search, partial failures, and saved results.", href: "/source" },
  { title: "Arabic localization sample", type: "Localization", status: "Published", text: "A small Arabic docs sample for location, gl, hl, async search, caching, and output formats.", href: "/localization" },
  { title: "Arabic Search Context Lab", type: "Product", status: "12 saved results", text: "Three Arabic searches across Baghdad, Riyadh, Cairo, and Casablanca using explicit local search settings.", href: "/" },
  { title: "Arabic technical guide", type: "Writing", status: "Published", text: "An Arabic guide to the implementation, the API settings, security, and the tradeoffs I ran into while building it.", href: "/guide" },
  { title: "Notes from using SerpApi", type: "Feedback", status: "Published", text: "What was easy, what slowed me down, and a few documentation changes I would test with more developer feedback.", href: "/feedback" },
  { title: "First 90 days", type: "Plan", status: "Published", text: "What I would try first: talk to developers, ship useful Arabic technical material, and keep the things people actually use.", href: "/plan" },
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
          <h1>Why I built this.</h1>
          <details className="miniInfo proofTruthInfo">
            <summary aria-label="About this project" title="About this project"><InfoIcon /></summary>
            <div>
              I built this independently for my application. I do not work for SerpApi, and I am not claiming any existing community partnerships.
            </div>
          </details>
        </div>
        <p>I wanted to apply with something you could open, run, and inspect.</p>
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
              <Link className="evidenceLink" href={item.href}>Open </Link>
            ) : (
              <a className="evidenceLink" href={item.href} target="_blank" rel="noreferrer">Open </a>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
