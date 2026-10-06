import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Arabic Project Walkthrough | Arabic Search Context Lab",
  description:
    "A 1:29 Arabic walkthrough of Arabic Search Context Lab, including the four-city comparison, localization settings, and async search setup.",
  openGraph: {
    title: "Arabic Project Walkthrough",
    description:
      "A short Arabic walkthrough of Arabic Search Context Lab.",
    images: ["https://arabic-search-context-lab-prod.onrender.com/walkthrough-poster.jpg"],
  },
};

const VIDEO_URL = "/walkthrough.mp4";
const POSTER_URL = "/walkthrough-poster.jpg";

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
            <Link className="subpageGhost" href="/proof">Work</Link>
            <Link className="subpageAction compactHeaderAction" href="/">Demo</Link>
          </nav>
        </div>
      </header>

      <section className="walkthroughHero">
        <div>
          <h1>Arabic project walkthrough.</h1>
          <p>
            I recorded this after finishing the project. In 1:29, I show the
            four-city comparison, the localization settings, and the async
            search setup.
          </p>
        </div>
      </section>

      <section className="walkthroughStage" aria-label="Arabic project walkthrough video">
        <div className="walkthroughVideoFrame">
          <video
            controls
            playsInline
            preload="metadata"
            poster={POSTER_URL}
            aria-label="Arabic Search Context Lab walkthrough in Arabic"
          >
            <source src={VIDEO_URL} type="video/mp4" />
            Your browser does not support HTML video.
          </video>
        </div>
      </section>

      <section className="walkthroughFacts" aria-label="What the video covers">
        <article>
          <span>Product</span>
          <strong>One query in four cities.</strong>
          <p>The same Arabic search runs in Baghdad, Riyadh, Cairo, and Casablanca.</p>
        </article>
        <article>
          <span>Localization</span>
          <strong>location, gl, hl</strong>
          <p>Each setting stays separate so it is clear what changes between cities.</p>
        </article>
        <article>
          <span>Engineering</span>
          <strong>Server-side key and async search</strong>
          <p>The API key stays on the server, and slow searches use async mode and Search Archive.</p>
        </article>
      </section>

      <section className="walkthroughNext">
        <div>
          <span>See the rest of the work</span>
          <strong>Code, notes, docs, and the 30/60/90 plan.</strong>
        </div>
        <Link className="walkthroughProofLink" href="/proof">
          Open project work <ArrowIcon />
        </Link>
      </section>
    </main>
  );
}
