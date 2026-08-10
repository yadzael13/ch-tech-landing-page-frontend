import { getCompany } from "@/lib/api/content";
import { hero } from "@/lib/content/site";
import HeroVideo from "./HeroVideo";

export default async function Hero() {
  // The hero is above the fold and must never show an error state, so a
  // failed fetch (or a Company with tagline/mission not yet filled in)
  // silently falls back to the static copy instead of surfacing "hasError"
  // like the other sections do.
  let headline = hero.fallbackHeadline;
  let subtext = hero.fallbackSubtext;

  try {
    const company = await getCompany();
    headline = company.tagline ?? headline;
    subtext = company.mission ?? subtext;
  } catch {
    // keep the static fallback
  }

  return <HeroVideo headline={headline} subtext={subtext} />;
}
