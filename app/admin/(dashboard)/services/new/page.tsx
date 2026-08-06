"use client";

import ServiceForm from "@/components/admin/ServiceForm";
import { createService } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ServiceWrite } from "@/lib/api/types";

export default function NewServicePage() {
  const { authedFetch } = useAuth();

  async function handleSubmit(payload: ServiceWrite) {
    await createService(authedFetch, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Nuevo servicio
      </h1>
      <div className="mt-6 max-w-2xl">
        <ServiceForm onSubmit={handleSubmit} submitLabel="Crear servicio" />
      </div>
    </div>
  );
}
