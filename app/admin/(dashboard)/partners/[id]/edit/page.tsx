"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PartnerForm from "@/components/admin/PartnerForm";
import { updatePartner } from "@/lib/api/admin";
import { getPartners } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import { PartnerItem, PartnerWrite } from "@/lib/api/types";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonForm } from "@/components/ui/SkeletonForm";

export default function EditPartnerPage() {
  const { id } = useParams<{ id: string }>();
  const { authedFetch } = useAuth();
  const [partner, setPartner] = useState<PartnerItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    // docs/API.md has no GET /partners/{id} or GET /admin/partners/{id} —
    // read the same public list the management table uses and pick the
    // matching row (same reasoning as clients/[id]/edit/page.tsx).
    getPartners()
      .then((data) => {
        const match = data.find((item) => item.id === id);
        if (!match) {
          setStatus("error");
          return;
        }
        setPartner(match);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  async function handleSubmit(payload: PartnerWrite) {
    await updatePartner(authedFetch, id, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Editar partner
      </h1>

      {status === "loading" && <SkeletonForm fields={4} />}
      {status === "error" && (
        <ErrorState message="No fue posible cargar el partner." />
      )}
      {status === "ready" && partner && (
        <div className="mt-6 max-w-2xl">
          <PartnerForm
            initialValue={partner}
            onSubmit={handleSubmit}
            submitLabel="Guardar cambios"
          />
        </div>
      )}
    </div>
  );
}
