import Link from "next/link";
import type { ReactNode } from "react";

export function ProofArticle({eyebrow,title,intro,dir="ltr",children}:{eyebrow:string;title:string;intro:string;dir?:"ltr"|"rtl";children:ReactNode}){
  return <main className="shell articleShell" dir={dir} lang={dir === "rtl" ? "ar" : "en"}>
    <nav className="articleNav"><Link href="/proof">← Proof pack</Link><Link href="/">Demo</Link></nav>
    <header className="articleHero"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="lede">{intro}</p></header>
    <article className="articleBody">{children}</article>
  </main>
}

export function Section({title,children}:{title:string;children:ReactNode}){return <section><h2>{title}</h2>{children}</section>}
export function Code({children}:{children:ReactNode}){return <pre dir="ltr"><code>{children}</code></pre>}
