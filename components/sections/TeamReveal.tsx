"use client";

import type { TeamMemberItem } from "@/lib/api/types";
import { cardClassName } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Reveal } from "@/components/ui/Reveal";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

interface TeamRevealProps {
  members: TeamMemberItem[];
  hasError: boolean;
}

export default function TeamReveal({ members, hasError }: TeamRevealProps) {
  const { ref, blockProps } = useSectionReveal<HTMLElement>();

  return (
    <section ref={ref} id="equipo" className="mx-auto max-w-6xl px-6 py-24">
      <h2
        {...blockProps(
          0,
          "font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground",
        )}
      >
        Equipo
      </h2>

      {hasError && (
        <ErrorState message="No fue posible cargar el equipo en este momento." />
      )}

      {!hasError && members.length === 0 && (
        <EmptyState message="Aún no hay miembros del equipo publicados." />
      )}

      {!hasError && members.length > 0 && (
        <div
          {...blockProps(1, "mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3")}
        >
          {members.map((member, index) => (
            <Reveal
              as="article"
              key={member.id}
              delayMs={index * 60}
              className={cardClassName({
                interactive: true,
                className: "flex flex-col gap-3",
              })}
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
              {member.bio && <p className="text-sm text-muted">{member.bio}</p>}
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
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
