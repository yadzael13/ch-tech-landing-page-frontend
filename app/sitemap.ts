import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/content/site";

// The public site is a single-page landing (docs/API.md/ARCHITECTURE.md —
// no public slug-based detail routes exist yet, only the admin panel edits
// content shown on "/"), so this lists exactly one URL, honestly.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
