"use client";

import TechnologyForm from "@/components/admin/TechnologyForm";
import { createTechnology } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { TechnologyWrite } from "@/lib/api/types";

export default function NewTechnologyPage() {
  const { authedFetch } = useAuth();

  async function handleSubmit(payload: TechnologyWrite) {
    await createTechnology(authedFetch, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Nueva tecnología
      </h1>
      <div className="mt-6 max-w-2xl">
        <TechnologyForm
          onSubmit={handleSubmit}
          submitLabel="Crear tecnología"
        />
      </div>
    </div>
  );
}
