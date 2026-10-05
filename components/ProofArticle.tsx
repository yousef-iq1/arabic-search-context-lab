import Link from "next/link";
import type { ReactNode } from "react";

export function ProofArticle({
  eyebrow,
  title,
  intro,
  dir = "ltr",
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  dir?: "ltr" | "rtl";
  children: ReactNode;
}) {
  return (
    <main className="shell articleShell articleShellV2" dir={dir} lang={dir === "rtl" ? "ar" : "en"}>
      <header className="subpageHeader">
        <Link className="brand brandStrong" href="/">Arabic Search Context Lab</Link>
        <div className="subpageHeaderActions">
          <Link className="subpageGhost" href="/proof">Proof</Link>
          <Link className="subpageAction" href="/">Demo</Link>
        </div>
      </header>

      <header className="articleHero articleHeroV2">
        <p className="proofKicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>

      <article className="articleBody articleBodyV2">{children}</article>
    </main>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="articleSection">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <pre dir="ltr">
      <code>{children}</code>
    </pre>
  );
}
