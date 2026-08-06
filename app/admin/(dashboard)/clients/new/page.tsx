"use client";

import ClientForm from "@/components/admin/ClientForm";
import { createClient } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ClientWrite } from "@/lib/api/types";

export default function NewClientPage() {
  const { authedFetch } = useAuth();

  async function handleSubmit(payload: ClientWrite) {
    await createClient(authedFetch, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Nuevo cliente
      </h1>
      <div className="mt-6 max-w-2xl">
        <ClientForm onSubmit={handleSubmit} submitLabel="Crear cliente" />
      </div>
    </div>
  );
}
