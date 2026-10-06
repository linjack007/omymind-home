"use client";
import { useEffect, useRef, useState } from "react";
import { useLocale, type Locale } from "./locale";
import { ChevronDown, Download, Globe, Smartphone } from "lucide-react";
// Replace null with verified store URLs when the apps are publicly available.
export const downloads: { ios: string | null; android: string | null } = { ios: null, android: null };
export function Brand() {
  return <span className="brand"><img src="/images/app-icon.webp" alt="" width="32" height="32" />Omymind</span>;
}
const languageOptions: { value: Locale; label: string; native: string }[] = [
  { value: "en", label: "English", native: "English" },
  { value: "zh", label: "Chinese", native: "中文" },
];
export function LanguageMenu() {
  const { t, locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [open]);
  const current = languageOptions.find((option) => option.value === locale) ?? languageOptions[0];
  return <div className="language-menu" ref={ref}>
    <button type="button" className="language-menu-button" aria-label={t.language} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
      <Globe aria-hidden="true" size={15} strokeWidth={1.8} /><span>{current.native}</span><ChevronDown aria-hidden="true" size={13} strokeWidth={2} />
    </button>
    {open && <div className="language-menu-list" role="listbox" aria-label={t.language}>
      {languageOptions.map((option) => <button type="button" key={option.value} role="option" aria-selected={locale === option.value} lang={option.value === "zh" ? "zh-CN" : "en"} onClick={() => { setLocale(option.value); setOpen(false); }}>
        <span>{option.native}</span><span className="language-menu-label">{option.label}</span>
      </button>)}
    </div>}
  </div>;
}
export function Header({ home = false }: { home?: boolean }) {
  const { t, locale } = useLocale();
  return <><a className="skip-link" href="#main">{t.skip}</a><header className="site-header"><nav className="header-inner" aria-label="Omymind"><a className="brand-link" href={`/?lang=${locale}`} aria-label="Omymind"><Brand /></a><div className="header-actions"><a className="header-download" href={home ? "#download" : `/?lang=${locale}#download`}>{t.download}</a><LanguageMenu /></div></nav></header></>;
}
export function DownloadLinks() {
  const { t } = useLocale();
  return <div className="download-links">{(["ios", "android"] as const).map((platform) => {
    const url = downloads[platform];
    const content = <>{platform === "ios" ? <Smartphone aria-hidden="true" size={25} strokeWidth={1.5} /> : <Download aria-hidden="true" size={25} strokeWidth={1.5} />}<span><span className="download-platform">{t[platform]}</span><span className="download-status">{url ? t.download : t.soon}</span></span></>;
    return url ? <a key={platform} className={`download-badge ${platform}`} href={url} target="_blank" rel="noopener noreferrer">{content}</a> : <span key={platform} className={`download-badge unavailable ${platform}`} aria-label={`${t[platform]} — ${t.soon}`}>{content}</span>;
  })}</div>;
}
export function Footer() {
  const { t, locale } = useLocale();
  return <footer className="site-footer"><div className="footer-top"><a href={`/?lang=${locale}`} className="brand-link"><Brand /></a><div className="footer-links"><a href={`/privacy?lang=${locale}`}>{t.privacy}</a><a href={`/terms?lang=${locale}`}>{t.terms}</a></div></div><div className="footer-bottom"><small>© 2026 Omymind. All rights reserved.</small></div></footer>;
}
