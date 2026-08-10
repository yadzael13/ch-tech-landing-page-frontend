"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTechnologies } from "@/lib/api/content";
import { deleteTechnology } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { TechnologyItem } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

export default function AdminTechnologiesPage() {
  const { authedFetch } = useAuth();
  const [technologies, setTechnologies] = useState<TechnologyItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [pendingDelete, setPendingDelete] = useState<TechnologyItem | null>(
    null,
  );

  useEffect(() => {
    // No isAuthLoading gate needed here (unlike projects/services): this is
    // the same public, unauthenticated read used on the Landing page —
    // Technology has no visibility/active concept requiring an admin token.
    getTechnologies()
      .then((data) => {
        setTechnologies(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  async function confirmDelete() {
    if (!pendingDelete) return;
    await deleteTechnology(authedFetch, pendingDelete.id);
    setTechnologies((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    );
    setPendingDelete(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Technologies
        </h1>
        <Button href="/admin/technologies/new" size="sm">
          Nueva tecnología
        </Button>
      </div>

      {status === "loading" && <SkeletonTable columns={3} />}

      {status === "error" && (
        <ErrorState message="No fue posible cargar las tecnologías." />
      )}

      {status === "ready" && technologies.length === 0 && (
        <EmptyState message="Aún no hay tecnologías." />
      )}

      {status === "ready" && technologies.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {technologies.map((technology) => (
                <tr
                  key={technology.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">
                    {technology.name}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {technology.category ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/technologies/${technology.id}/edit`}
                        className="focus-ring rounded text-accent transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(technology)}
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
        title="¿Eliminar tecnología?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" se eliminará. Esta acción no se puede deshacer.`
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
