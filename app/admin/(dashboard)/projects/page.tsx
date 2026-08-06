"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteProject, getAdminProjects } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProjectDetail } from "@/lib/api/types";

export default function AdminProjectsPage() {
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
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

  async function handleDelete(project: ProjectDetail) {
    if (
      !window.confirm(
        `¿Eliminar "${project.title}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    await deleteProject(authedFetch, project.id);
    setProjects((current) => current.filter((item) => item.id !== project.id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Projects
        </h1>
        <Link
          href="/admin/projects/new"
          className="focus-ring rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98]"
        >
          Nuevo proyecto
        </Link>
      </div>

      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar los proyectos.
        </p>
      )}

      {status === "ready" && projects.length === 0 && (
        <p className="mt-6 text-sm text-muted">Aún no hay proyectos.</p>
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
                        onClick={() => handleDelete(project)}
                        className="focus-ring rounded text-red-400 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
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
    </div>
  );
}
