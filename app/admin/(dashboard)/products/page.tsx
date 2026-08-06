"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteProduct } from "@/lib/api/admin";
import { getProducts } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProductItem } from "@/lib/api/types";

export default function AdminProductsPage() {
  const { authedFetch } = useAuth();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

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

  async function handleDelete(product: ProductItem) {
    if (
      !window.confirm(
        `¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    await deleteProduct(authedFetch, product.id);
    setProducts((current) =>
      current.filter((item) => item.id !== product.id),
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="focus-ring rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98]"
        >
          Nuevo producto
        </Link>
      </div>

      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar los productos.
        </p>
      )}

      {status === "ready" && products.length === 0 && (
        <p className="mt-6 text-sm text-muted">Aún no hay productos.</p>
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
                  <td className="px-4 py-3 text-foreground">
                    {product.name}
                  </td>
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
                        onClick={() => handleDelete(product)}
                        className="focus-ring rounded text-red-400 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
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
    </div>
  );
}
