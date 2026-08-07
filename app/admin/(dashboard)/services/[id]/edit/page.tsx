"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ServiceForm from "@/components/admin/ServiceForm";
import { getAdminService, updateService } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ServiceItem, ServiceWrite } from "@/lib/api/types";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonForm } from "@/components/ui/SkeletonForm";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    getAdminService(authedFetch, id)
      .then((data) => {
        setService(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [authedFetch, id, isAuthLoading]);

  async function handleSubmit(payload: ServiceWrite) {
    await updateService(authedFetch, id, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Editar servicio
      </h1>

      {status === "loading" && <SkeletonForm fields={4} />}
      {status === "error" && (
        <ErrorState message="No fue posible cargar el servicio." />
      )}
      {status === "ready" && service && (
        <div className="mt-6 max-w-2xl">
          <ServiceForm
            initialValue={service}
            onSubmit={handleSubmit}
            submitLabel="Guardar cambios"
          />
        </div>
      )}
    </div>
  );
}
