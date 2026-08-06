import { getFeaturedProjects } from "@/lib/api/content";

export default async function Projects() {
  let projects: Awaited<ReturnType<typeof getFeaturedProjects>> = [];
  let hasError = false;

  try {
    projects = await getFeaturedProjects();
  } catch {
    hasError = true;
  }

  return (
    <section id="proyectos" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground">
        Proyectos
      </h2>

      {hasError && (
        <p className="mt-6 text-sm text-muted">
          No fue posible cargar los proyectos en este momento.
        </p>
      )}

      {!hasError && projects.length === 0 && (
        <p className="mt-6 text-sm text-muted">
          Aún no hay proyectos destacados publicados.
        </p>
      )}

      {!hasError && projects.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
            >
              {project.featured && (
                <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-medium text-background">
                  Destacado
                </span>
              )}
              <h3 className="font-medium text-foreground">{project.title}</h3>
              <p className="text-sm text-muted">{project.slug}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
