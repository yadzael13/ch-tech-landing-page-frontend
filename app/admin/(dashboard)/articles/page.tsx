"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteArticle, getAdminArticles } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ArticleDetail } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

export default function AdminArticlesPage() {
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [articles, setArticles] = useState<ArticleDetail[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [pendingDelete, setPendingDelete] = useState<ArticleDetail | null>(
    null,
  );

  useEffect(() => {
    // Wait for AuthContext's own mount-time silent refresh to settle first —
    // see the same comment in projects/page.tsx.
    if (isAuthLoading) {
      return;
    }
    getAdminArticles(authedFetch)
      .then((data) => {
        setArticles(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [isAuthLoading, authedFetch]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    await deleteArticle(authedFetch, pendingDelete.id);
    setArticles((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    );
    setPendingDelete(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Articles
        </h1>
        <Button href="/admin/articles/new" size="sm">
          Nuevo artículo
        </Button>
      </div>

      {status === "loading" && <SkeletonTable columns={4} />}

      {status === "error" && (
        <ErrorState message="No fue posible cargar los artículos." />
      )}

      {status === "ready" && articles.length === 0 && (
        <EmptyState message="Aún no hay artículos." />
      )}

      {status === "ready" && articles.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Publicado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">{article.title}</td>
                  <td className="px-4 py-3 text-muted">{article.slug}</td>
                  <td className="px-4 py-3 text-muted">
                    {article.published ? "Sí" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="focus-ring rounded text-accent transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(article)}
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
        title="¿Eliminar artículo?"
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
