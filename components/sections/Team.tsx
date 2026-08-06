import { getTeamMembers } from "@/lib/api/content";

export default async function Team() {
  let members: Awaited<ReturnType<typeof getTeamMembers>> = [];
  let hasError = false;

  try {
    members = await getTeamMembers();
  } catch {
    hasError = true;
  }

  return (
    <section id="equipo" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground">
        Equipo
      </h2>

      {hasError && (
        <p className="mt-6 text-sm text-muted">
          No fue posible cargar el equipo en este momento.
        </p>
      )}

      {!hasError && members.length === 0 && (
        <p className="mt-6 text-sm text-muted">
          Aún no hay miembros del equipo publicados.
        </p>
      )}

      {!hasError && members.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article
              key={member.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent"
            >
              {member.photo && (
                // eslint-disable-next-line @next/next/no-img-element -- external, admin-supplied photo URLs; no next/image domain config exists yet.
                <img
                  src={member.photo}
                  alt={member.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium text-foreground">{member.name}</p>
                <p className="text-sm text-accent">{member.role}</p>
              </div>
              {member.bio && (
                <p className="text-sm text-muted">{member.bio}</p>
              )}
              <div className="mt-auto flex gap-4 text-sm">
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring rounded text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
                  >
                    LinkedIn
                  </a>
                )}
                {member.github_url && (
                  <a
                    href={member.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring rounded text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
