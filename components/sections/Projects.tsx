import { getFeaturedProjects } from "@/lib/api/content";
import { cardClassName } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Reveal } from "@/components/ui/Reveal";

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
        <ErrorState message="No fue posible cargar los proyectos en este momento." />
      )}

      {!hasError && projects.length === 0 && (
        <EmptyState message="Aún no hay proyectos destacados publicados." />
      )}

      {!hasError && projects.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Reveal
              as="article"
              key={project.id}
              delayMs={index * 60}
              className={cardClassName({
                interactive: true,
                className: "flex flex-col gap-2",
              })}
            >
              {project.featured && (
                <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-medium text-background">
                  Destacado
                </span>
              )}
              <h3 className="font-medium text-foreground">{project.title}</h3>
              <p className="text-sm text-muted">{project.slug}</p>
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
