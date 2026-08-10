"use client";

import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { Reveal } from "@/components/ui/Reveal";
import { cardClassName } from "@/components/ui/Card";
import { about } from "@/lib/content/site";
import { cx } from "@/lib/cx";

interface AboutRevealProps {
  intro: string;
}

const STAGGER_MS = 150;

/**
 * Client half of About: a section-level bidirectional reveal (unlike the
 * one-shot `Reveal` component elsewhere, this keeps observing for the
 * section's whole lifetime — see useScrollReveal's once:false). Deliberately
 * asymmetric per feedback: the entrance is the "detailed" direction — title,
 * intro and the card grid each fade+slide in with their own delay, on top
 * of the cards' existing individual delayMs stagger — while the exit is
 * a single, simple, un-staggered fade (every block drops out together),
 * since a receding section reads better as one dissolve than as a reverse
 * stagger.
 */
export default function AboutReveal({ intro }: AboutRevealProps) {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ once: false });

  const blockClassName = (delayMs: number, className?: string) =>
    cx(
      "transition-opacity duration-500 ease-in-out",
      isVisible ? "animate-fade-in-up-slow" : "opacity-0",
      className,
    );

  const blockStyle = (delayMs: number) =>
    isVisible ? { animationDelay: `${delayMs}ms` } : undefined;

  return (
    <section
      ref={ref}
      id="sobre-ch-tech"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <h2
        style={blockStyle(0)}
        className={blockClassName(
          0,
          "font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground",
        )}
      >
        {about.title}
      </h2>
      <p
        style={blockStyle(STAGGER_MS)}
        className={blockClassName(STAGGER_MS, "mt-4 max-w-2xl text-muted")}
      >
        {intro}
      </p>

      <ol
        style={blockStyle(STAGGER_MS * 2)}
        className={blockClassName(
          STAGGER_MS * 2,
          "mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {about.points.map((point, index) => (
          <Reveal
            as="li"
            key={point.title}
            delayMs={index * 60}
            className={cardClassName({
              interactive: true,
              className: "flex gap-4",
            })}
          >
            <span className="text-sm font-semibold text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-medium text-foreground">{point.title}</p>
              <p className="mt-1 text-sm text-muted">{point.description}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
