import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Arabic Technical Walkthrough | Arabic Search Context Lab",
  description:
    "A 1:29 Arabic walkthrough of the SerpApi-powered search-context demo, localization choices, and engineering decisions.",
  openGraph: {
    title: "Arabic Technical Walkthrough",
    description:
      "A short Arabic walkthrough of the product, localization choices, and engineering decisions behind Arabic Search Context Lab.",
    images: ["https://trading-v.hoaster.page/yousef-serpapi-arabic-walkthrough-poster"],
  },
};

const VIDEO_URL = "https://trading-v.hoaster.page/yousef-serpapi-arabic-walkthrough";
const POSTER_URL = "https://trading-v.hoaster.page/yousef-serpapi-arabic-walkthrough-poster";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6 14 14 6M8 6h6v6" />
    </svg>
  );
}

export default function WalkthroughPage() {
  return (
    <main className="shell walkthroughShell" dir="ltr" lang="en">
      <header className="subpageHeader portfolioHeader">
        <div className="subpageHeaderInner">
          <Link className="brand brandStrong" href="/">Arabic Search Context Lab</Link>
          <nav className="articleTopActions" aria-label="Project navigation">
            <Link className="subpageGhost" href="/proof">Proof</Link>
            <Link className="subpageAction compactHeaderAction" href="/">Demo</Link>
          </nav>
        </div>
      </header>

      <section className="walkthroughHero">
        <div>
          <span className="walkthroughMeta">
            <i aria-hidden="true" />
            Arabic · 1:29
          </span>
          <h1>Arabic technical walkthrough.</h1>
          <p>
            A short, real explanation of the product, localization choices, and
            engineering decisions behind the demo.
          </p>
        </div>
      </section>

      <section className="walkthroughStage" aria-label="Arabic technical walkthrough video">
        <div className="walkthroughVideoFrame">
          <video
            controls
            playsInline
            preload="metadata"
            poster={POSTER_URL}
            aria-label="Arabic Search Context Lab technical walkthrough in Arabic"
          >
            <source src={VIDEO_URL} type="video/mp4" />
            Your browser does not support HTML video.
          </video>
        </div>
      </section>

      <section className="walkthroughFacts" aria-label="Walkthrough coverage">
        <article>
          <span>Product</span>
          <strong>Same intent, four markets.</strong>
          <p>Baghdad, Riyadh, Cairo, and Casablanca in one controlled comparison.</p>
        </article>
        <article>
          <span>Localization</span>
          <strong>location · gl · hl</strong>
          <p>The search context is explicit, not reduced to translation or RTL.</p>
        </article>
        <article>
          <span>Engineering</span>
          <strong>Server-side · async · snapshots</strong>
          <p>Key protection, slow-search handling, and quota-safe public evidence.</p>
        </article>
      </section>

      <section className="walkthroughNext">
        <div>
          <span>Want the evidence behind the walkthrough?</span>
          <strong>Open the complete proof pack.</strong>
        </div>
        <Link className="walkthroughProofLink" href="/proof">
          Proof of fit <ArrowIcon />
        </Link>
      </section>
    </main>
  );
}
