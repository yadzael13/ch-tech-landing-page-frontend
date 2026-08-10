"use client";

import type { TechnologyItem } from "@/lib/api/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Reveal } from "@/components/ui/Reveal";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

interface TechStackRevealProps {
  technologies: TechnologyItem[];
  hasError: boolean;
}

export default function TechStackReveal({
  technologies,
  hasError,
}: TechStackRevealProps) {
  const { ref, blockProps } = useSectionReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="tecnologias"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <h2
        {...blockProps(
          0,
          "font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground",
        )}
      >
        Tecnologías
      </h2>

      {hasError && (
        <ErrorState message="No fue posible cargar las tecnologías en este momento." />
      )}

      {!hasError && technologies.length === 0 && (
        <EmptyState message="Aún no hay tecnologías publicadas." />
      )}

      {!hasError && technologies.length > 0 && (
        <ul {...blockProps(1, "mt-8 flex flex-wrap gap-3")}>
          {technologies.map((technology, index) => (
            <Reveal
              as="li"
              key={technology.id}
              delayMs={index * 60}
              className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:text-accent"
            >
              {technology.name}
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
