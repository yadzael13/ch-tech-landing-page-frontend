"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteCaseStudy, getAdminCaseStudies } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { CaseStudyItem } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

export default function AdminCaseStudiesPage() {
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [pendingDelete, setPendingDelete] = useState<CaseStudyItem | null>(
    null,
  );

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    getAdminCaseStudies(authedFetch)
      .then((data) => {
        setCaseStudies(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [isAuthLoading, authedFetch]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    await deleteCaseStudy(authedFetch, pendingDelete.id);
    setCaseStudies((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    );
    setPendingDelete(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Case Studies
        </h1>
        <Button href="/admin/case-studies/new" size="sm">
          Nuevo caso de estudio
        </Button>
      </div>

      {status === "loading" && <SkeletonTable columns={3} />}

      {status === "error" && (
        <ErrorState message="No fue posible cargar los casos de estudio." />
      )}

      {status === "ready" && caseStudies.length === 0 && (
        <EmptyState message="Aún no hay casos de estudio." />
      )}

      {status === "ready" && caseStudies.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Desafío</th>
                <th className="px-4 py-3 font-medium">Proyecto</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {caseStudies.map((caseStudy) => (
                <tr
                  key={caseStudy.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">
                    {caseStudy.challenge ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {caseStudy.project_id}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/case-studies/${caseStudy.id}/edit`}
                        className="focus-ring rounded text-accent transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(caseStudy)}
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
        title="¿Eliminar caso de estudio?"
        description="Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        destructive
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
