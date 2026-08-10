"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteProject, getAdminProjects } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProjectDetail } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

export default function AdminProjectsPage() {
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [pendingDelete, setPendingDelete] = useState<ProjectDetail | null>(
    null,
  );

  useEffect(() => {
    // Wait for AuthContext's own mount-time silent refresh to settle first —
    // firing immediately would run this with a stale null access token, then
    // again once the real one arrives, flashing the list back to "loading".
    // The .then()/.catch() chain (rather than an intermediate async
    // function) keeps every setState call lexically inside a deferred
    // callback, which eslint-plugin-react-hooks' set-state-in-effect rule
    // requires.
    if (isAuthLoading) {
      return;
    }
    getAdminProjects(authedFetch)
      .then((data) => {
        setProjects(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [isAuthLoading, authedFetch]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    await deleteProject(authedFetch, pendingDelete.id);
    setProjects((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    );
    setPendingDelete(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Projects
        </h1>
        <Button href="/admin/projects/new" size="sm">
          Nuevo proyecto
        </Button>
      </div>

      {status === "loading" && <SkeletonTable columns={6} />}

      {status === "error" && (
        <ErrorState message="No fue posible cargar los proyectos." />
      )}

      {status === "ready" && projects.length === 0 && (
        <EmptyState message="Aún no hay proyectos." />
      )}

      {status === "ready" && projects.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Visibilidad</th>
                <th className="px-4 py-3 font-medium">Destacado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">{project.title}</td>
                  <td className="px-4 py-3 text-muted">{project.slug}</td>
                  <td className="px-4 py-3 text-muted">{project.status}</td>
                  <td className="px-4 py-3 text-muted">{project.visibility}</td>
                  <td className="px-4 py-3 text-muted">
                    {project.featured ? "Sí" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="focus-ring rounded text-accent transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(project)}
                        className="focus-ring rounded text-danger transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={pendingDelete !== null}
        title="¿Eliminar proyecto?"
        description={
          pendingDelete
            ? `"${pendingDelete.title}" se eliminará. Esta acción no se puede deshacer.`
            : undefined
        }
        confirmLabel="Eliminar"
        destructive
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
