"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteArticle, getAdminArticles } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ArticleDetail } from "@/lib/api/types";

export default function AdminArticlesPage() {
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [articles, setArticles] = useState<ArticleDetail[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
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

  async function handleDelete(article: ArticleDetail) {
    if (
      !window.confirm(
        `¿Eliminar "${article.title}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    await deleteArticle(authedFetch, article.id);
    setArticles((current) => current.filter((item) => item.id !== article.id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Articles
        </h1>
        <Link
          href="/admin/articles/new"
          className="focus-ring rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98]"
        >
          Nuevo artículo
        </Link>
      </div>

      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar los artículos.
        </p>
      )}

      {status === "ready" && articles.length === 0 && (
        <p className="mt-6 text-sm text-muted">Aún no hay artículos.</p>
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
                        onClick={() => handleDelete(article)}
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
