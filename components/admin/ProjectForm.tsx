"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTechnologies } from "@/lib/api/content";
import { ProjectDetail, ProjectWrite, TechnologyItem } from "@/lib/api/types";

const inputClass =
  "focus-ring rounded-lg border border-border bg-surface px-4 py-2 text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent/60";

const STATUS_OPTIONS = ["PLANNING", "IN_PROGRESS", "COMPLETED", "ARCHIVED"];
const VISIBILITY_OPTIONS = ["PRIVATE", "PUBLIC"];

interface ProjectFormProps {
  initialValue?: ProjectDetail;
  onSubmit: (payload: ProjectWrite) => Promise<void>;
  submitLabel: string;
}

export default function ProjectForm({
  initialValue,
  onSubmit,
  submitLabel,
}: ProjectFormProps) {
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

    const payload: ProjectWrite = {
      slug: String(formData.get("slug") ?? ""),
      title: String(formData.get("title") ?? ""),
      short_description:
        String(formData.get("short_description") ?? "") || null,
      full_description: String(formData.get("full_description") ?? "") || null,
      repository_url: String(formData.get("repository_url") ?? "") || null,
      live_demo_url: String(formData.get("live_demo_url") ?? "") || null,
      cover_image: String(formData.get("cover_image") ?? "") || null,
      status: String(formData.get("status") ?? "PLANNING"),
      visibility: String(formData.get("visibility") ?? "PRIVATE"),
      featured: formData.get("featured") === "on",
      started_at: String(formData.get("started_at") ?? "") || null,
      finished_at: String(formData.get("finished_at") ?? "") || null,
      technology_ids: formData.getAll("technology_ids").map(String),
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await onSubmit(payload);
      router.push("/admin/projects");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el proyecto.",
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
        Descripción corta
        <input
          name="short_description"
          type="text"
          defaultValue={initialValue?.short_description ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Descripción completa
        <textarea
          name="full_description"
          rows={5}
          defaultValue={initialValue?.full_description ?? ""}
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Repositorio
          <input
            name="repository_url"
            type="url"
            defaultValue={initialValue?.repository_url ?? ""}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Demo en vivo
          <input
            name="live_demo_url"
            type="url"
            defaultValue={initialValue?.live_demo_url ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Imagen de portada (URL)
        <input
          name="cover_image"
          type="url"
          defaultValue={initialValue?.cover_image ?? ""}
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Estado
          <select
            name="status"
            defaultValue={initialValue?.status ?? "PLANNING"}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Visibilidad
          <select
            name="visibility"
            defaultValue={initialValue?.visibility ?? "PRIVATE"}
            className={inputClass}
          >
            {VISIBILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Inicio
          <input
            name="started_at"
            type="date"
            defaultValue={initialValue?.started_at ?? ""}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Fin
          <input
            name="finished_at"
            type="date"
            defaultValue={initialValue?.finished_at ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input
          name="featured"
          type="checkbox"
          defaultChecked={initialValue?.featured}
          className="focus-ring h-4 w-4 rounded border-border"
        />
        Destacado
      </label>

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
