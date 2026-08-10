"use client";

import { useSectionReveal } from "@/lib/hooks/useSectionReveal";
import { Reveal } from "@/components/ui/Reveal";
import { cardClassName } from "@/components/ui/Card";
import { about } from "@/lib/content/site";

interface AboutRevealProps {
  intro: string;
}

/**
 * Client half of About: a section-level bidirectional reveal (see
 * useSectionReveal) — title, intro and the card grid each fade+slide in
 * with their own stagger on entrance, on top of the cards' existing
 * individual delayMs stagger, and fade+slide out the same staggered way on
 * exit.
 */
export default function AboutReveal({ intro }: AboutRevealProps) {
  const { ref, blockProps } = useSectionReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="sobre-ch-tech"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <h2
        {...blockProps(
          0,
          "font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground",
        )}
      >
        {about.title}
      </h2>
      <p {...blockProps(1, "mt-4 max-w-2xl text-muted")}>{intro}</p>

      <ol {...blockProps(2, "mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3")}>
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
