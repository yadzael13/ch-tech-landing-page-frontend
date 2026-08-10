"use client";

import type { ProductItem } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { cardClassName } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Reveal } from "@/components/ui/Reveal";
import { useSectionReveal } from "@/lib/hooks/useSectionReveal";

const STATUS_LABELS: Record<string, string> = {
  WAITLIST: "Lista de espera",
  BETA: "Beta",
  LIVE: "Disponible",
};

interface ProductsRevealProps {
  products: ProductItem[];
  hasError: boolean;
}

export default function ProductsReveal({
  products,
  hasError,
}: ProductsRevealProps) {
  const { ref, blockProps } = useSectionReveal<HTMLElement>();

  return (
    <section ref={ref} id="productos" className="mx-auto max-w-6xl px-6 py-24">
      <h2
        {...blockProps(
          0,
          "font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground",
        )}
      >
        Productos SaaS
      </h2>

      {hasError && (
        <ErrorState message="No fue posible cargar los productos en este momento." />
      )}

      {!hasError && products.length === 0 && (
        <div {...blockProps(1, "mt-6 flex flex-col items-start gap-4")}>
          <EmptyState
            message="Estamos construyendo nuestra primera línea de productos SaaS."
            className="mt-0"
          />
          <Button href="#contacto" variant="secondary">
            Únete a la lista de espera
          </Button>
        </div>
      )}

      {!hasError && products.length > 0 && (
        <div {...blockProps(1, "mt-8 grid gap-6 md:grid-cols-3")}>
          {products.map((product, index) => (
            <Reveal
              as="article"
              key={product.id}
              delayMs={index * 60}
              className={cardClassName({
                interactive: true,
                className: "flex flex-col gap-3",
              })}
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
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
