"use client";
import { useEffect, useRef } from "react";
import { Header, DownloadLinks, Footer } from "./site-chrome";
import { useLocale } from "./locale";
import { courses, sounds, type ShowcaseItem } from "./showcase-data";

export function Phone({ screen, alt, className = "", eager = false }: { screen: string; alt: string; className?: string; eager?: boolean }) {
  return <div className={`phone ${className}`}><img src={`/images/screens/${screen}.webp`} alt={alt} width="780" height="1696" loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : "auto"} /></div>;
}
/** Big-label feature heading: label is the oversized title, title becomes a light subtitle. */
function FeatureCopy({ label, title, badge, id }: { label: string; title: string; badge?: string; id: string }) {
  return <div className="section-copy feature-copy" data-reveal><h2 className="feature-headline" id={id}>{label}</h2><p className="feature-subhead">{title}{badge && <span className="feature-badge">{badge}</span>}</p></div>;
}
function CourseMarqueeRow({ items, reverse = false, offset = false }: { items: ShowcaseItem[]; reverse?: boolean; offset?: boolean }) {
  const { locale } = useLocale();
  const track = [...items, ...items];
  return <div className={`course-marquee${offset ? " course-marquee-offset" : ""}`}>
    <div className={`course-track${reverse ? " course-track-reverse" : ""}`}>
      {track.map((course, index) => <figure className="course-tile" key={`${course.src}-${index}`}>
        <img src={course.src} alt={locale === "zh" ? course.zh : course.en} loading="lazy" width="600" height="900" />
        <figcaption>{locale === "zh" ? course.zh : course.en}</figcaption>
      </figure>)}
    </div>
  </div>;
}
export function HomePage() {
  const { t, locale } = useLocale();
  const localeName = (item: ShowcaseItem) => (locale === "zh" ? item.zh : item.en);
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-waiting");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    const elements = mainRef.current?.querySelectorAll("[data-reveal]");
    elements?.forEach((element) => {
      if (element.getBoundingClientRect().top > innerHeight) element.classList.add("reveal-waiting");
      observer.observe(element);
    });
    function showAll() { if (media.matches) elements?.forEach((element) => element.classList.remove("reveal-waiting")); }
    media.addEventListener("change", showAll);
    return () => { observer.disconnect(); media.removeEventListener("change", showAll); elements?.forEach((element) => element.classList.remove("reveal-waiting")); };
  }, []);
  return <><Header home /><main id="main" ref={mainRef}>
    <section className="hero" aria-labelledby="hero-heading">
      <div className="hero-copy"><p className="eyebrow">Omymind</p><h1 id="hero-heading">{t.hero}</h1><p className="intro">{t.heroBody}</p><DownloadLinks /></div>
      <div className="hero-stage" aria-label="Omymind"><Phone screen="focus-timer" alt={t.focusAlt} className="hero-left" eager /><Phone screen="meditation" alt={t.meditationAlt} className="hero-center" eager /><Phone screen="sleep" alt={t.sleepAlt} className="hero-right" eager /></div>
    </section>
    <section className="meditation-section section" aria-labelledby="meditation-heading">
      <FeatureCopy label={t.meditation} title={t.meditationTitle} badge={t.meditationMeta} id="meditation-heading" />
      <div className="course-marquee-group" data-reveal>
        <CourseMarqueeRow items={courses.slice(0, 8)} />
        <CourseMarqueeRow items={courses.slice(8, 16)} reverse offset />
      </div>
    </section>
    <section className="focus-section section" aria-labelledby="focus-heading">
      <div className="split-layout"><FeatureCopy label={t.focus} title={t.focusTitle} id="focus-heading" /><div className="focus-art" data-reveal><Phone screen="focus-timer" alt={t.focusAlt} /></div></div>
    </section>
    <section className="sleep-section section" aria-labelledby="sleep-heading">
      <div className="split-layout"><FeatureCopy label={t.sleep} title={t.sleepTitle} id="sleep-heading" /><div className="sleep-art" data-reveal><Phone screen="sleep" alt={t.sleepAlt} /></div></div>
    </section>
    <section className="sounds-section section" aria-labelledby="sounds-heading">
      <FeatureCopy label={t.sounds} title={t.soundsTitle} badge={t.soundsMeta} id="sounds-heading" />
      <div className="sound-acc" data-reveal>{sounds.map((sound) => <figure className="sound-acc-item" key={sound.src}>
        <div className="sound-acc-frame"><img src={sound.src} alt={localeName(sound)} loading="lazy" width="600" height="900" /></div>
        <figcaption>{localeName(sound)}</figcaption>
      </figure>)}</div>
    </section>
    <section id="download" className="final-cta" aria-labelledby="download-heading"><div data-reveal><img className="cta-icon" src="/images/app-icon.webp" alt="" width="72" height="72" loading="lazy" /><p className="eyebrow">Omymind</p><h2 id="download-heading">{t.cta}</h2><p className="intro">{t.ctaBody}</p><DownloadLinks /></div></section>
  </main><Footer /></>;
}
