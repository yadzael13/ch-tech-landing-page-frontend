import { getServiceLines } from "@/lib/api/content";
import { cardClassName } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Reveal } from "@/components/ui/Reveal";

export default async function BusinessLines() {
  let serviceLines: Awaited<ReturnType<typeof getServiceLines>> = [];
  let hasError = false;

  try {
    serviceLines = await getServiceLines();
  } catch {
    hasError = true;
  }

  return (
    <section id="lineas-de-negocio" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground">
        Líneas de negocio
      </h2>

      {hasError && (
        <ErrorState message="No fue posible cargar las líneas de negocio en este momento." />
      )}

      {!hasError && serviceLines.length === 0 && (
        <EmptyState message="Aún no hay líneas de negocio publicadas." />
      )}

      {!hasError && serviceLines.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {serviceLines.map((line, index) => (
            <Reveal
              as="article"
              key={line.id}
              delayMs={index * 60}
              className={cardClassName({
                interactive: true,
                className: "flex flex-col gap-3",
              })}
            >
              <h3 className="font-medium text-foreground">{line.name}</h3>
              {line.description && (
                <p className="text-sm text-muted">{line.description}</p>
              )}
              <a
                href="#contacto"
                className="focus-ring mt-auto w-fit rounded-full text-sm font-medium text-accent transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80 active:scale-[0.98]"
              >
                Solicitar información →
              </a>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
