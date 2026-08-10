"use client";

import type { ClientItem } from "@/lib/api/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Reveal } from "@/components/ui/Reveal";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

interface ClientsRevealProps {
  clients: ClientItem[];
  hasError: boolean;
}

export default function ClientsReveal({
  clients,
  hasError,
}: ClientsRevealProps) {
  const { ref, blockProps } = useSectionReveal<HTMLElement>();

  return (
    <section ref={ref} id="clientes" className="mx-auto max-w-6xl px-6 py-24">
      <h2
        {...blockProps(
          0,
          "font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground",
        )}
      >
        Clientes
      </h2>

      {hasError && (
        <ErrorState message="No fue posible cargar los clientes en este momento." />
      )}

      {!hasError && clients.length === 0 && (
        <EmptyState message="Aún no hay clientes públicos." />
      )}

      {!hasError && clients.length > 0 && (
        <ul {...blockProps(1, "mt-8 flex flex-wrap items-center gap-8")}>
          {clients.map((client, index) => (
            <Reveal
              as="li"
              key={client.id}
              delayMs={index * 60}
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-3 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent"
            >
              {client.logo ? (
                // eslint-disable-next-line @next/next/no-img-element -- external, admin-supplied logo URLs; no next/image domain config exists yet.
                <img
                  src={client.logo}
                  alt={client.name}
                  width={96}
                  height={24}
                  className="h-6 w-24 object-contain"
                />
              ) : (
                <span className="text-sm font-medium text-foreground">
                  {client.name}
                </span>
              )}
            </Reveal>
          ))}
        </ul>
      )}
    </section>
  );
}
