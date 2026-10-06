import { LegalPage } from "@/components/website/legal-page";
import documents from "@/content/legal.json";
export const dynamic = "force-static";
export const metadata = { title: "Privacy Policy · Omymind", description: "Read the Omymind Privacy Policy, including information use, your choices, and how to contact us." };
export default function Privacy() { return <LegalPage documents={documents.privacy} />; }
