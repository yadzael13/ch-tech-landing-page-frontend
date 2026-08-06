import { getTestimonials } from "@/lib/api/content";

export default async function Testimonials() {
  let testimonials: Awaited<ReturnType<typeof getTestimonials>> = [];
  let hasError = false;

  try {
    testimonials = (await getTestimonials()).filter((t) => t.featured);
  } catch {
    hasError = true;
  }

  return (
    <section id="testimonios" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground">
        Testimonios
      </h2>

      {hasError && (
        <p className="mt-6 text-sm text-muted">
          No fue posible cargar los testimonios en este momento.
        </p>
      )}

      {!hasError && testimonials.length === 0 && (
        <p className="mt-6 text-sm text-muted">
          Aún no hay testimonios publicados.
        </p>
      )}

      {!hasError && testimonials.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
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
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
