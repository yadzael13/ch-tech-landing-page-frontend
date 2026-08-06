"use client";

import CaseStudyForm from "@/components/admin/CaseStudyForm";
import { createCaseStudy } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { CaseStudyWrite } from "@/lib/api/types";

export default function NewCaseStudyPage() {
  const { authedFetch } = useAuth();

  async function handleSubmit(payload: CaseStudyWrite) {
    await createCaseStudy(authedFetch, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Nuevo caso de estudio
      </h1>
      <div className="mt-6 max-w-2xl">
        <CaseStudyForm
          onSubmit={handleSubmit}
          submitLabel="Crear caso de estudio"
        />
      </div>
    </div>
  );
}
