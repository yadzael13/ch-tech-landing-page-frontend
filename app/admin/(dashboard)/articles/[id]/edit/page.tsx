"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ArticleForm from "@/components/admin/ArticleForm";
import { getAdminArticle, updateArticle } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ArticleDetail, ArticleWrite } from "@/lib/api/types";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonForm } from "@/components/ui/SkeletonForm";

export default function EditArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }
    getAdminArticle(authedFetch, id)
      .then((data) => {
        setArticle(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [authedFetch, id, isAuthLoading]);

  async function handleSubmit(payload: ArticleWrite) {
    await updateArticle(authedFetch, id, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Editar artículo
      </h1>

      {status === "loading" && <SkeletonForm fields={7} />}
      {status === "error" && (
        <ErrorState message="No fue posible cargar el artículo." />
      )}
      {status === "ready" && article && (
        <div className="mt-6 max-w-2xl">
          <ArticleForm
            initialValue={article}
            onSubmit={handleSubmit}
            submitLabel="Guardar cambios"
          />
        </div>
      )}
    </div>
  );
}
