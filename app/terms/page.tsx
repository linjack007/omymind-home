import { LegalPage } from "@/components/website/legal-page";
import documents from "@/content/legal.json";
export const dynamic = "force-static";
export const metadata = { title: "Terms of Service · Omymind", description: "Read the Omymind Terms of Service for app usage, subscriptions, and support." };
export default function Terms() { return <LegalPage documents={documents.terms} />; }
