"use client";

import PartnerForm from "@/components/admin/PartnerForm";
import { createPartner } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { PartnerWrite } from "@/lib/api/types";

export default function NewPartnerPage() {
  const { authedFetch } = useAuth();

  async function handleSubmit(payload: PartnerWrite) {
    await createPartner(authedFetch, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Nuevo partner
      </h1>
      <div className="mt-6 max-w-2xl">
        <PartnerForm onSubmit={handleSubmit} submitLabel="Crear partner" />
      </div>
    </div>
  );
}
