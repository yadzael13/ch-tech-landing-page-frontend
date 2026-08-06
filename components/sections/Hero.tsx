import { getCompany } from "@/lib/api/content";
import { hero } from "@/lib/content/site";

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

  return (
    <section className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-6 py-24 md:py-32">
      <span className="rounded-full border border-border px-3 py-1 text-xs font-medium tracking-widest text-accent uppercase">
        {hero.eyebrow}
      </span>

      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-foreground md:text-6xl">
        {headline}
      </h1>

      <p className="max-w-2xl text-lg text-muted">{subtext}</p>

      <div className="flex flex-wrap items-center gap-4 pt-2">
        <a
          href={hero.primaryCta.href}
          className="focus-ring group flex items-center gap-3 rounded-full border border-border bg-surface py-2 pr-2 pl-6 text-sm font-medium text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_24px_-8px_var(--color-accent)] active:scale-[0.98]"
        >
          {hero.primaryCta.label}
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-background transition-transform duration-200 ease-in-out group-hover:translate-x-0.5"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
        <a
          href={hero.secondaryCta.href}
          className="focus-ring rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:text-accent active:scale-[0.98]"
        >
          {hero.secondaryCta.label}
        </a>
      </div>
    </section>
  );
}
