"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteProduct } from "@/lib/api/admin";
import { getProducts } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProductItem } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

export default function AdminProductsPage() {
  const { authedFetch } = useAuth();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [pendingDelete, setPendingDelete] = useState<ProductItem | null>(null);

  useEffect(() => {
    // Public read (docs/API.md has no GET /admin/products) — same reasoning
    // as clients/page.tsx.
    getProducts()
      .then((data) => {
        setProducts(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  async function confirmDelete() {
    if (!pendingDelete) return;
    await deleteProduct(authedFetch, pendingDelete.id);
    setProducts((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    );
    setPendingDelete(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Products
        </h1>
        <Button href="/admin/products/new" size="sm">
          Nuevo producto
        </Button>
      </div>

      {status === "loading" && <SkeletonTable columns={5} />}

      {status === "error" && (
        <ErrorState message="No fue posible cargar los productos." />
      )}

      {status === "ready" && products.length === 0 && (
        <EmptyState message="Aún no hay productos." />
      )}

      {status === "ready" && products.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Destacado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">{product.name}</td>
                  <td className="px-4 py-3 text-muted">{product.slug}</td>
                  <td className="px-4 py-3 text-muted">{product.status}</td>
                  <td className="px-4 py-3 text-muted">
                    {product.featured ? "Sí" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="focus-ring rounded text-accent transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(product)}
                        className="focus-ring rounded text-danger transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={pendingDelete !== null}
        title="¿Eliminar producto?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" se eliminará. Esta acción no se puede deshacer.`
            : undefined
        }
        confirmLabel="Eliminar"
        destructive
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
