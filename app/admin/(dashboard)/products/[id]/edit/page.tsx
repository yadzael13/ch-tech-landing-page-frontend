"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { updateProduct } from "@/lib/api/admin";
import { getProducts } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProductItem, ProductWrite } from "@/lib/api/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { authedFetch } = useAuth();
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    // docs/API.md has no GET /admin/products/{id} — GET /products/{slug}
    // exists but the edit route only has the id, so read the same public
    // list the management table uses and pick the matching row (same
    // reasoning as clients/[id]/edit/page.tsx).
    getProducts()
      .then((data) => {
        const match = data.find((item) => item.id === id);
        if (!match) {
          setStatus("error");
          return;
        }
        setProduct(match);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  async function handleSubmit(payload: ProductWrite) {
    await updateProduct(authedFetch, id, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Editar producto
      </h1>

      {status === "loading" && (
        <p className="mt-6 text-sm text-muted">Cargando...</p>
      )}
      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar el producto.
        </p>
      )}
      {status === "ready" && product && (
        <div className="mt-6 max-w-2xl">
          <ProductForm
            initialValue={product}
            onSubmit={handleSubmit}
            submitLabel="Guardar cambios"
          />
        </div>
      )}
    </div>
  );
}
