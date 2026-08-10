"use client";

import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useTypewriter } from "@/lib/hooks/useTypewriter";
import { useScrollFade } from "@/lib/hooks/useScrollFade";
import { cx } from "@/lib/cx";
import { hero } from "@/lib/content/site";

interface HeroVideoProps {
  headline: string;
  subtext: string;
}

/**
 * Client half of the hero: the logo video fills the left column, the
 * (secondary) copy and CTAs sit on the right against a near-black panel —
 * matching the video's own backdrop, with the page's grid texture kept
 * (bg-grid) rather than going flat, since an opaque panel would otherwise
 * paint over body's background-image. The video loops via the native
 * autoplay/loop attributes (no JS playback control needed — this also
 * sidesteps any client-hydration-timing gap, since the browser starts it
 * straight from the server-rendered HTML). With prefers-reduced-motion,
 * autoplay/loop are dropped so it just sits on its first frame as a static
 * image stand-in, the headline renders in full immediately (no typing
 * animation), and the caret stops blinking (global CSS guard in
 * globals.css neutralizes every animation, this one included). The copy's
 * opacity also tracks scroll position directly (useScrollFade, no CSS
 * transition racing it) — full opacity at the top, fading out over the
 * first 400px scrolled and back in on the way up — disabled under
 * prefers-reduced-motion, where the text just stays fully visible.
 */
export default function HeroVideo({ headline, subtext }: HeroVideoProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const typedHeadline = useTypewriter(headline, !prefersReducedMotion);

  const scrollFadeOpacity = useScrollFade();
  const copyOpacity = prefersReducedMotion ? 1 : scrollFadeOpacity;

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden md:flex-row">
      <div className="relative h-[50vh] w-full md:h-screen md:w-1/2">
        <video
          key={String(prefersReducedMotion)}
          src="/videos/header-logo.mp4"
          muted
          playsInline
          preload="auto"
          autoPlay={!prefersReducedMotion}
          loop={!prefersReducedMotion}
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="bg-grid flex w-full flex-col items-start justify-center gap-6 px-6 py-16 md:w-1/2 md:px-16 md:py-24">
        <div
          style={{ opacity: copyOpacity }}
          className={cx(
            "flex flex-col items-start gap-6",
            copyOpacity === 0 && "pointer-events-none",
          )}
        >
          <span className="animate-fade-in-up rounded-full border border-border px-3 py-1 text-xs font-medium tracking-widest text-accent uppercase">
            {hero.eyebrow}
          </span>

          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground md:text-4xl">
            <span aria-hidden="true">{typedHeadline}</span>
            <span
              aria-hidden="true"
              className="animate-caret-blink text-accent"
            >
              |
            </span>
            <span className="sr-only">{headline}</span>
          </h1>

          <p className="animate-fade-in-up max-w-2xl text-base text-muted [animation-delay:160ms]">
            {subtext}
          </p>

          <div className="animate-fade-in-up flex flex-wrap items-center gap-4 pt-2 [animation-delay:240ms]">
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
        </div>
      </div>

      <svg
        aria-hidden="true"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full opacity-70 md:h-56"
      >
        <path
          d="M0,224L80,234.7C160,245,320,267,480,245.3C640,224,800,160,960,144C1120,128,1280,160,1360,176L1440,192L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
          fill="var(--color-background)"
        />
      </svg>
    </section>
  );
}
