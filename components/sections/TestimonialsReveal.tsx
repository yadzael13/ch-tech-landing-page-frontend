"use client";

import type { TestimonialItem } from "@/lib/api/types";
import { cardClassName } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Reveal } from "@/components/ui/Reveal";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

interface TestimonialsRevealProps {
  testimonials: TestimonialItem[];
  hasError: boolean;
}

export default function TestimonialsReveal({
  testimonials,
  hasError,
}: TestimonialsRevealProps) {
  const { ref, blockProps } = useSectionReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      id="testimonios"
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <h2
        {...blockProps(
          0,
          "font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground",
        )}
      >
        Testimonios
      </h2>

      {hasError && (
        <ErrorState message="No fue posible cargar los testimonios en este momento." />
      )}

      {!hasError && testimonials.length === 0 && (
        <EmptyState message="Aún no hay testimonios publicados." />
      )}

      {!hasError && testimonials.length > 0 && (
        <div
          {...blockProps(1, "mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3")}
        >
          {testimonials.map((testimonial, index) => (
            <Reveal
              as="figure"
              key={testimonial.id}
              delayMs={index * 60}
              className={cardClassName({
                interactive: true,
                className: "flex flex-col gap-4",
              })}
            >
              <blockquote className="text-sm text-foreground">
                “{testimonial.content}”
              </blockquote>
              <figcaption className="mt-auto text-sm text-muted">
                <span className="font-medium text-foreground">
                  {testimonial.author_name}
                </span>
                {testimonial.author_role && <> — {testimonial.author_role}</>}
              </figcaption>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
