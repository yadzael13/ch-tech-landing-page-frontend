"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TechnologyForm from "@/components/admin/TechnologyForm";
import { getTechnology } from "@/lib/api/content";
import { updateTechnology } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { TechnologyItem, TechnologyWrite } from "@/lib/api/types";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonForm } from "@/components/ui/SkeletonForm";

export default function EditTechnologyPage() {
  const { id } = useParams<{ id: string }>();
  const { authedFetch } = useAuth();
  const [technology, setTechnology] = useState<TechnologyItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    // Public read (see technologies/page.tsx) — no isAuthLoading gate needed.
    getTechnology(id)
      .then((data) => {
        setTechnology(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  async function handleSubmit(payload: TechnologyWrite) {
    await updateTechnology(authedFetch, id, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Editar tecnología
      </h1>

      {status === "loading" && <SkeletonForm fields={4} />}
      {status === "error" && (
        <ErrorState message="No fue posible cargar la tecnología." />
      )}
      {status === "ready" && technology && (
        <div className="mt-6 max-w-2xl">
          <TechnologyForm
            initialValue={technology}
            onSubmit={handleSubmit}
            submitLabel="Guardar cambios"
          />
        </div>
      )}
    </div>
  );
}
