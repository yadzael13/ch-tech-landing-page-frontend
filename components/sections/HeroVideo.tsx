"use client";

import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useVideoBoomerang } from "@/lib/hooks/useVideoBoomerang";
import { hero } from "@/lib/content/site";

interface HeroVideoProps {
  headline: string;
  subtext: string;
}

/**
 * Client half of the hero: the logo video fills the left column, the
 * (secondary) copy and CTAs sit on the right against a surface-tinted
 * panel — a color separation only, no new page style. The video loops
 * forward/reverse/forward indefinitely (see useVideoBoomerang) rather than
 * reacting to scroll. With prefers-reduced-motion, it just sits paused on
 * its first frame as a static image stand-in.
 */
export default function HeroVideo({ headline, subtext }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useVideoBoomerang({
    videoRef,
    enabled: !prefersReducedMotion,
  });

  return (
    <section className="relative flex min-h-screen w-full flex-col overflow-hidden md:flex-row">
      <div className="relative h-[50vh] w-full md:h-screen md:w-1/2">
        <video
          ref={videoRef}
          src="/videos/header-logo.mp4"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex w-full flex-col items-start justify-center gap-6 bg-surface px-6 py-16 md:w-1/2 md:px-16 md:py-24">
        <span className="animate-fade-in-up rounded-full border border-border px-3 py-1 text-xs font-medium tracking-widest text-accent uppercase">
          {hero.eyebrow}
        </span>

        <h1 className="animate-fade-in-up font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-foreground [animation-delay:80ms] md:text-4xl">
          {headline}
        </h1>

        <p className="animate-fade-in-up max-w-2xl text-base text-muted [animation-delay:160ms]">
          {subtext}
        </p>

        <div className="animate-fade-in-up flex flex-wrap items-center gap-4 pt-2 [animation-delay:240ms]">
          <a
            href={hero.primaryCta.href}
            className="focus-ring group flex items-center gap-3 rounded-full border border-border bg-background py-2 pr-2 pl-6 text-sm font-medium text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_24px_-8px_var(--color-accent)] active:scale-[0.98]"
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

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent md:h-32"
      />
    </section>
  );
}
