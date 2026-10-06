import Link from "next/link";
export default function NotFound() {
  return <main className="final-cta"><p className="eyebrow">Omymind · 404</p><h1>This page has drifted away.</h1><p className="intro" style={{ marginTop: 24 }}>页面未找到。</p><Link className="legal-back" href="/">Back to Omymind / 返回首页</Link></main>;
}
