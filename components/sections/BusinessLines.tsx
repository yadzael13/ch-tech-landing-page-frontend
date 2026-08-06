import { getServiceLines } from "@/lib/api/content";

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
        <p className="mt-6 text-sm text-muted">
          No fue posible cargar las líneas de negocio en este momento.
        </p>
      )}

      {!hasError && serviceLines.length === 0 && (
        <p className="mt-6 text-sm text-muted">
          Aún no hay líneas de negocio publicadas.
        </p>
      )}

      {!hasError && serviceLines.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {serviceLines.map((line) => (
            <article
              key={line.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
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
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
