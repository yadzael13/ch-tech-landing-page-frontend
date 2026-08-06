"use client";

import ArticleForm from "@/components/admin/ArticleForm";
import { createArticle } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ArticleWrite } from "@/lib/api/types";

export default function NewArticlePage() {
  const { authedFetch } = useAuth();

  async function handleSubmit(payload: ArticleWrite) {
    await createArticle(authedFetch, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Nuevo artículo
      </h1>
      <div className="mt-6 max-w-2xl">
        <ArticleForm onSubmit={handleSubmit} submitLabel="Crear artículo" />
      </div>
    </div>
  );
}
