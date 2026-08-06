"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteCaseStudy, getAdminCaseStudies } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { CaseStudyItem } from "@/lib/api/types";

export default function AdminCaseStudiesPage() {
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [caseStudies, setCaseStudies] = useState<CaseStudyItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
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

  async function handleDelete(caseStudy: CaseStudyItem) {
    if (
      !window.confirm(
        `¿Eliminar este caso de estudio? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    await deleteCaseStudy(authedFetch, caseStudy.id);
    setCaseStudies((current) =>
      current.filter((item) => item.id !== caseStudy.id),
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Case Studies
        </h1>
        <Link
          href="/admin/case-studies/new"
          className="focus-ring rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98]"
        >
          Nuevo caso de estudio
        </Link>
      </div>

      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar los casos de estudio.
        </p>
      )}

      {status === "ready" && caseStudies.length === 0 && (
        <p className="mt-6 text-sm text-muted">Aún no hay casos de estudio.</p>
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
                        onClick={() => handleDelete(caseStudy)}
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
