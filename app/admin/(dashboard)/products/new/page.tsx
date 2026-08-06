"use client";

import ProductForm from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProductWrite } from "@/lib/api/types";

export default function NewProductPage() {
  const { authedFetch } = useAuth();

  async function handleSubmit(payload: ProductWrite) {
    await createProduct(authedFetch, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Nuevo producto
      </h1>
      <div className="mt-6 max-w-2xl">
        <ProductForm onSubmit={handleSubmit} submitLabel="Crear producto" />
      </div>
    </div>
  );
}
