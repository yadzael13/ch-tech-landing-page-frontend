"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTechnologies } from "@/lib/api/content";
import { ArticleDetail, ArticleWrite, TechnologyItem } from "@/lib/api/types";

const inputClass =
  "focus-ring rounded-lg border border-border bg-surface px-4 py-2 text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent/60";

interface ArticleFormProps {
  initialValue?: ArticleDetail;
  onSubmit: (payload: ArticleWrite) => Promise<void>;
  submitLabel: string;
}

/** <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm", not a full ISO
 * string with seconds/timezone — trims whatever the API gave us to fit. */
function toDatetimeLocal(value: string | null): string {
  return value ? value.slice(0, 16) : "";
}

export default function ArticleForm({
  initialValue,
  onSubmit,
  submitLabel,
}: ArticleFormProps) {
  const router = useRouter();
  const [technologies, setTechnologies] = useState<TechnologyItem[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getTechnologies()
      .then(setTechnologies)
      .catch(() => setTechnologies([]));
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const published = formData.get("published") === "on";
    const publishedAt = String(formData.get("published_at") ?? "");

    const payload: ArticleWrite = {
      slug: String(formData.get("slug") ?? ""),
      title: String(formData.get("title") ?? ""),
      summary: String(formData.get("summary") ?? "") || null,
      content: String(formData.get("content") ?? ""),
      cover_image: String(formData.get("cover_image") ?? "") || null,
      reading_time: formData.get("reading_time")
        ? Number(formData.get("reading_time"))
        : null,
      published,
      published_at: publishedAt ? new Date(publishedAt).toISOString() : null,
      technology_ids: formData.getAll("technology_ids").map(String),
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await onSubmit(payload);
      router.push("/admin/articles");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el artículo.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Título
          <input
            name="title"
            type="text"
            required
            maxLength={255}
            defaultValue={initialValue?.title}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Slug
          <input
            name="slug"
            type="text"
            required
            maxLength={150}
            defaultValue={initialValue?.slug}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Resumen
        <input
          name="summary"
          type="text"
          defaultValue={initialValue?.summary ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Contenido
        <textarea
          name="content"
          required
          rows={10}
          defaultValue={initialValue?.content ?? ""}
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Imagen de portada (URL)
          <input
            name="cover_image"
            type="url"
            defaultValue={initialValue?.cover_image ?? ""}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Tiempo de lectura (min)
          <input
            name="reading_time"
            type="number"
            min={1}
            defaultValue={initialValue?.reading_time ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            name="published"
            type="checkbox"
            defaultChecked={initialValue?.published}
            className="focus-ring h-4 w-4 rounded border-border"
          />
          Publicado
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Fecha de publicación
          <input
            name="published_at"
            type="datetime-local"
            defaultValue={toDatetimeLocal(initialValue?.published_at ?? null)}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Tecnologías
        <select
          name="technology_ids"
          multiple
          defaultValue={initialValue?.technologies.map((tech) => tech.id) ?? []}
          className={`${inputClass} h-32`}
        >
          {technologies.map((technology) => (
            <option key={technology.id} value={technology.id}>
              {technology.name}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="focus-ring mt-2 w-fit rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
      >
        {status === "submitting" ? "Guardando..." : submitLabel}
      </button>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
