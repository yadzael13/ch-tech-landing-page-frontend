"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTechnologies } from "@/lib/api/content";
import { deleteTechnology } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { TechnologyItem } from "@/lib/api/types";

export default function AdminTechnologiesPage() {
  const { authedFetch } = useAuth();
  const [technologies, setTechnologies] = useState<TechnologyItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
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

  async function handleDelete(technology: TechnologyItem) {
    if (
      !window.confirm(
        `¿Eliminar "${technology.name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    await deleteTechnology(authedFetch, technology.id);
    setTechnologies((current) =>
      current.filter((item) => item.id !== technology.id),
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Technologies
        </h1>
        <Link
          href="/admin/technologies/new"
          className="focus-ring rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98]"
        >
          Nueva tecnología
        </Link>
      </div>

      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar las tecnologías.
        </p>
      )}

      {status === "ready" && technologies.length === 0 && (
        <p className="mt-6 text-sm text-muted">Aún no hay tecnologías.</p>
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
                        onClick={() => handleDelete(technology)}
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
