import { getProducts } from "@/lib/api/content";

const STATUS_LABELS: Record<string, string> = {
  WAITLIST: "Lista de espera",
  BETA: "Beta",
  LIVE: "Disponible",
};

export default async function Products() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let hasError = false;

  try {
    products = await getProducts();
  } catch {
    hasError = true;
  }

  return (
    <section id="productos" className="mx-auto max-w-6xl px-6 py-24">
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground">
        Productos SaaS
      </h2>

      {hasError && (
        <p className="mt-6 text-sm text-muted">
          No fue posible cargar los productos en este momento.
        </p>
      )}

      {!hasError && products.length === 0 && (
        <div className="mt-6 flex flex-col items-start gap-4">
          <p className="text-sm text-muted">
            Estamos construyendo nuestra primera línea de productos SaaS.
          </p>
          <a
            href="#contacto"
            className="focus-ring w-fit rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            Únete a la lista de espera
          </a>
        </div>
      )}

      {!hasError && products.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
            >
              <span className="w-fit rounded-full border border-border px-3 py-1 text-xs font-medium text-accent">
                {STATUS_LABELS[product.status] ?? product.status}
              </span>
              <h3 className="font-medium text-foreground">{product.name}</h3>
              {product.short_description && (
                <p className="text-sm text-muted">
                  {product.short_description}
                </p>
              )}
              {product.url && (
                <a
                  href={product.url}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring mt-auto w-fit rounded-full text-sm font-medium text-accent transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80 active:scale-[0.98]"
                >
                  Ver producto →
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
