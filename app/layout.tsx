import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/components/website/locale";
import { siteOrigin, siteTitle, siteDescription } from "@/lib/site-config";
export const metadata: Metadata = {
  ...(siteOrigin ? { metadataBase: new URL(siteOrigin) } : {}),
  title: siteTitle,
  description: siteDescription,
  applicationName: "Omymind",
  icons: { icon: "/images/app-icon.webp", apple: "/images/app-icon.webp" },
  ...(siteOrigin ? { alternates: { canonical: "/" } } : {}),
  openGraph: { title: siteTitle, description: siteDescription, siteName: "Omymind", type: "website", locale: "en_US", alternateLocale: ["zh_CN"], ...(siteOrigin ? { url: siteOrigin } : {}), images: [{ url: siteOrigin ? `${siteOrigin}/og.png` : "/og.png", width: 1200, height: 630, alt: "Omymind — Find your moment. Focus, meditate and sleep." }] },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription, images: [siteOrigin ? `${siteOrigin}/og.png` : "/og.png"] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><LocaleProvider>{children}</LocaleProvider></body></html>;
}
