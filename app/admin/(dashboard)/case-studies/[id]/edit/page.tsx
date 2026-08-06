"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CaseStudyForm from "@/components/admin/CaseStudyForm";
import { getAdminCaseStudy, updateCaseStudy } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { CaseStudyItem, CaseStudyWrite } from "@/lib/api/types";

export default function EditCaseStudyPage() {
  const { id } = useParams<{ id: string }>();
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [caseStudy, setCaseStudy] = useState<CaseStudyItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    getAdminCaseStudy(authedFetch, id)
      .then((data) => {
        setCaseStudy(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [authedFetch, id, isAuthLoading]);

  async function handleSubmit(payload: CaseStudyWrite) {
    await updateCaseStudy(authedFetch, id, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Editar caso de estudio
      </h1>

      {status === "loading" && (
        <p className="mt-6 text-sm text-muted">Cargando...</p>
      )}
      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar el caso de estudio.
        </p>
      )}
      {status === "ready" && caseStudy && (
        <div className="mt-6 max-w-2xl">
          <CaseStudyForm
            initialValue={caseStudy}
            onSubmit={handleSubmit}
            submitLabel="Guardar cambios"
          />
        </div>
      )}
    </div>
  );
}
