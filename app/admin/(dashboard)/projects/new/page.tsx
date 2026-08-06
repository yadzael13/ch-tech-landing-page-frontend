"use client";

import ProjectForm from "@/components/admin/ProjectForm";
import { createProject } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProjectWrite } from "@/lib/api/types";

export default function NewProjectPage() {
  const { authedFetch } = useAuth();

  async function handleSubmit(payload: ProjectWrite) {
    await createProject(authedFetch, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Nuevo proyecto
      </h1>
      <div className="mt-6 max-w-2xl">
        <ProjectForm onSubmit={handleSubmit} submitLabel="Crear proyecto" />
      </div>
    </div>
  );
}
