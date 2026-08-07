"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getAdminProject, updateProject } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProjectDetail, ProjectWrite } from "@/lib/api/types";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonForm } from "@/components/ui/SkeletonForm";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    // Wait for the mount-time silent refresh to settle first — see the same
    // comment in projects/page.tsx.
    if (isAuthLoading) {
      return;
    }
    getAdminProject(authedFetch, id)
      .then((data) => {
        setProject(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [authedFetch, id, isAuthLoading]);

  async function handleSubmit(payload: ProjectWrite) {
    await updateProject(authedFetch, id, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Editar proyecto
      </h1>

      {status === "loading" && <SkeletonForm fields={10} />}
      {status === "error" && (
        <ErrorState message="No fue posible cargar el proyecto." />
      )}
      {status === "ready" && project && (
        <div className="mt-6 max-w-2xl">
          <ProjectForm
            initialValue={project}
            onSubmit={handleSubmit}
            submitLabel="Guardar cambios"
          />
        </div>
      )}
    </div>
  );
}
