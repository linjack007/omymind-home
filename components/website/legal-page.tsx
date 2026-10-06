"use client";
import { Fragment, type ReactNode } from "react";
import { Footer, Header } from "./site-chrome";
import { useLocale } from "./locale";

// The bundled App policies use headings, paragraphs, lists and emphasis.
// React escapes all source text; no Markdown HTML is executed.
function inline(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\))/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i}>{inline(part.slice(2, -2))}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <span key={i}>{part.slice(1, -1)}</span>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    return link ? <a key={i} href={link[2]} rel="noopener noreferrer">{link[1]}</a> : <Fragment key={i}>{part}</Fragment>;
  });
}
export function PolicyBody({ source }: { source: string }) {
  return <article className="legal-body">{source.trim().split(/\n\s*\n/).map((block, i) => {
    if (/^---+$/.test(block.trim())) return <hr key={i} />;
    if (block.startsWith("### ")) return <h3 key={i}>{inline(block.slice(4))}</h3>;
    if (block.startsWith("## ")) return <h2 key={i}>{inline(block.slice(3))}</h2>;
    if (block.startsWith("# ")) return <h1 key={i}>{inline(block.slice(2))}</h1>;
    if (/^- /m.test(block)) return <ul key={i}>{block.split(/\n(?=- )/).map((item, j) => <li key={j}>{inline(item.replace(/^- /, ""))}</li>)}</ul>;
    return <p key={i}>{inline(block)}</p>;
  })}</article>;
}
export function LegalPage({ documents }: { documents: { en: string; zh: string } }) {
  const { t, locale } = useLocale();
  return <><Header /><main id="main" className="legal-main"><a href={`/?lang=${locale}`} className="legal-back">{t.back}</a><PolicyBody source={documents[locale]} /></main><Footer /></>;
}
