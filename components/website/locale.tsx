"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
export const copy = {
  en: {
    download: "Download", soon: "Coming soon", ios: "App Store", android: "Android", skip: "Skip to content",
    hero: "Find your moment", heroBody: "Focus. Meditate. Sleep.\nA quieter space for your mind",
    focus: "Focus", focusTitle: "Stay with what matters", focusBody: "Create a calm space for deep work,\nreading, studying, or simply getting things done",
    meditation: "Meditation", meditationTitle: "A few minutes can change your day", meditationMeta: "1000+ Courses", meditationBody: "Guided meditation for quiet mornings,\nbusy afternoons and everything in between",
    sleep: "Sleep", sleepTitle: "Let the day fade away", sleepBody: "Wind down with calming sounds,\nsleep stories and gentle meditation",
    sounds: "Sounds", soundsTitle: "A world of calm, one sound away", soundsMeta: "100+ Sounds & Music", soundsBody: "Rain, forests, oceans, cafés and more.\nChoose the sound that feels right for this moment",
    cta: "Make some space\nfor yourself", ctaBody: "Start with Omymind",
    privacy: "Privacy Policy", terms: "Terms of Service", back: "Back to Omymind", language: "Language",
    morning: "A gentle morning", breathing: "Return to your breath", lettingGo: "Let the day go",
    rain: "Rain", ocean: "Ocean", forest: "Forest", train: "Train",
    focusAlt: "The Omymind focus screen", meditationAlt: "Guided meditation courses in Omymind", sleepAlt: "The Omymind sleep screen", soundsAlt: "The Omymind sound library",
    title: "Omymind — Focus, Meditation & Sleep", description: "Omymind helps you focus, meditate, relax and sleep with calming sounds and mindful experiences",
  },
  zh: {
    download: "下载", soon: "即将上线", ios: "App Store", android: "Android", skip: "跳至正文",
    hero: "找到属于你的片刻", heroBody: "专注、冥想与睡眠。\n给自己一个更安静的空间",
    focus: "专注", focusTitle: "专注于真正重要的事", focusBody: "用声音与时间，为工作、学习和阅读\n创造一个更专注的空间",
    meditation: "冥想", meditationTitle: "几分钟，也可以改变一天", meditationMeta: "1000+ 课程", meditationBody: "在清晨、午后或一天结束时，\n给自己几分钟安静下来",
    sleep: "睡眠", sleepTitle: "让一天慢慢安静下来", sleepBody: "用声音、睡眠内容与冥想，\n陪你慢慢进入夜晚",
    sounds: "声音", soundsTitle: "一个声音，就是一片新的空间", soundsMeta: "100+ 声音与音乐", soundsBody: "雨声、森林、海浪、咖啡馆……\n找到此刻最适合你的声音",
    cta: "给自己\n留一点空间", ctaBody: "从 Omymind 开始",
    privacy: "隐私政策", terms: "服务条款", back: "返回 Omymind", language: "语言",
    morning: "清晨温柔醒来", breathing: "呼吸觉察七日练习", lettingGo: "睡前把白天放下",
    rain: "雨声", ocean: "海浪", forest: "森林", train: "列车",
    focusAlt: "Omymind 专注界面", meditationAlt: "Omymind 冥想课程界面", sleepAlt: "Omymind 睡眠界面", soundsAlt: "Omymind 声音库界面",
    title: "Omymind — 专注、冥想与睡眠", description: "用舒缓的声音与正念体验，陪伴你专注、冥想、放松和睡眠。找到属于你的片刻",
  },
};
export type Locale = keyof typeof copy;
const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void }>({ locale: "en", setLocale: () => {} });
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>("en");
  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem("omymind-language"); } catch { /* Storage is optional. */ }
    const query = new URLSearchParams(location.search).get("lang");
    const preferred = query === "zh" || query === "en" ? query : stored;
    // Language preferences are browser-only and must be applied after static hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateLocale(preferred === "zh" || preferred === "en" ? preferred : navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en");
  }, []);
  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    const path = window.location.pathname.replace(/\/$/, "");
    const title = path === "/privacy" ? copy[locale].privacy : path === "/terms" ? copy[locale].terms : "";
    document.title = title ? `${title} · Omymind` : copy[locale].title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", copy[locale].description);
  }, [locale]);
  function setLocale(next: Locale) {
    updateLocale(next);
    try { localStorage.setItem("omymind-language", next); } catch { /* Private browsing still works. */ }
    const url = new URL(location.href); url.searchParams.set("lang", next); history.replaceState(null, "", url);
  }
  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}
export function useLocale() { const context = useContext(LocaleContext); return { ...context, t: copy[context.locale] }; }
