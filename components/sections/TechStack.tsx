import { getTechnologies } from "@/lib/api/content";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Reveal } from "@/components/ui/Reveal";

export default async function TechStack() {
  let technologies: Awaited<ReturnType<typeof getTechnologies>> = [];
  let hasError = false;

  try {
    technologies = await getTechnologies();
  } catch {
    hasError = true;
  }

  return (
    <section id="tecnologias" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground">
        Tecnologías
      </h2>

      {hasError && (
        <ErrorState message="No fue posible cargar las tecnologías en este momento." />
      )}

      {!hasError && technologies.length === 0 && (
        <EmptyState message="Aún no hay tecnologías publicadas." />
      )}

      {!hasError && technologies.length > 0 && (
        <ul className="mt-8 flex flex-wrap gap-3">
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
