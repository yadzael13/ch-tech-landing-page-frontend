import type { Metadata } from "next";
import { getCompany } from "@/lib/api/content";
import { siteUrl } from "@/lib/content/site";

export const DEFAULT_TITLE = "CH-TECH — Ingeniería de Software & IA";
export const DEFAULT_DESCRIPTION =
  "CH-TECH es una startup de Ingeniería de Software e Inteligencia Artificial que diseña, desarrolla e implementa soluciones tecnológicas para empresas.";

/** Builds the root layout's metadata from the live Company profile, with a
 * static fallback on failure — kept out of app/layout.tsx so it can be unit
 * tested without pulling in next/font/google (vitest.config.ts excludes
 * layout.tsx from testing for exactly that reason). */
export async function buildMetadata(): Promise<Metadata> {
  let title = DEFAULT_TITLE;
  let description = DEFAULT_DESCRIPTION;

  try {
    const company = await getCompany();
    title = `${company.display_name} — Ingeniería de Software & IA`;
    description = company.tagline ?? description;
  } catch {
    // keep the static fallback
  }

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: "CH-TECH",
      type: "website",
      locale: "es_MX",
    },
  };
}
