"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useScrollScrub } from "@/lib/hooks/useScrollScrub";
import { hero } from "@/lib/content/site";

interface HeroVideoProps {
  headline: string;
  subtext: string;
}

/**
 * Client half of the hero: the logo video plus the (now secondary) copy and
 * CTAs below it. Split out from Hero.tsx (a server component that still
 * owns the getCompany() fetch) because autoplay/scroll-scrub need refs and
 * effects. With prefers-reduced-motion, the video neither autoplays nor
 * scrubs — it stays on its first frame as a static image stand-in.
 */
export default function HeroVideo({ headline, subtext }: HeroVideoProps) {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    videoRef.current?.play()?.catch(() => {});
  }, [prefersReducedMotion]);

  useScrollScrub({
    containerRef,
    videoRef,
    enabled: !prefersReducedMotion,
  });

  return (
    <section
      ref={containerRef}
      className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-6 py-16 md:py-24"
    >
      <video
        ref={videoRef}
        src="/videos/header-logo.mp4"
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="w-full"
      />

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
