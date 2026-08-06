"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TechnologyForm from "@/components/admin/TechnologyForm";
import { getTechnology } from "@/lib/api/content";
import { updateTechnology } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { TechnologyItem, TechnologyWrite } from "@/lib/api/types";

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

      {status === "loading" && (
        <p className="mt-6 text-sm text-muted">Cargando...</p>
      )}
      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar la tecnología.
        </p>
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
