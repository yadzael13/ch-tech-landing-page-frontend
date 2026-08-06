import { getClients } from "@/lib/api/content";

export default async function Clients() {
  let clients: Awaited<ReturnType<typeof getClients>> = [];
  let hasError = false;

  try {
    clients = await getClients();
  } catch {
    hasError = true;
  }

  return (
    <section id="clientes" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground">
        Clientes
      </h2>

      {hasError && (
        <p className="mt-6 text-sm text-muted">
          No fue posible cargar los clientes en este momento.
        </p>
      )}

      {!hasError && clients.length === 0 && (
        <p className="mt-6 text-sm text-muted">Aún no hay clientes públicos.</p>
      )}

      {!hasError && clients.length > 0 && (
        <ul className="mt-8 flex flex-wrap items-center gap-8">
          {clients.map((client) => (
            <li
              key={client.id}
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
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
