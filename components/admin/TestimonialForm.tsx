"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminProjects } from "@/lib/api/admin";
import { getClients } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  ClientItem,
  ProjectDetail,
  TestimonialItem,
  TestimonialWrite,
} from "@/lib/api/types";

const inputClass =
  "focus-ring rounded-lg border border-border bg-surface px-4 py-2 text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent/60";

interface TestimonialFormProps {
  initialValue?: TestimonialItem;
  onSubmit: (payload: TestimonialWrite) => Promise<void>;
  submitLabel: string;
}

export default function TestimonialForm({
  initialValue,
  onSubmit,
  submitLabel,
}: TestimonialFormProps) {
  const router = useRouter();
  const { authedFetch } = useAuth();
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch(() => setClients([]));
    // Admin-only list (not the public one): a testimonial can point at a
    // PRIVATE project, same reasoning as CaseStudyForm.
    getAdminProjects(authedFetch)
      .then(setProjects)
      .catch(() => setProjects([]));
  }, [authedFetch]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ratingRaw = String(formData.get("rating") ?? "").trim();

    const payload: TestimonialWrite = {
      author_name: String(formData.get("author_name") ?? ""),
      author_role: String(formData.get("author_role") ?? "") || null,
      client_id: String(formData.get("client_id") ?? "") || null,
      project_id: String(formData.get("project_id") ?? "") || null,
      content: String(formData.get("content") ?? ""),
      rating: ratingRaw ? Number(ratingRaw) : null,
      featured: formData.get("featured") === "on",
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await onSubmit(payload);
      router.push("/admin/testimonials");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el testimonio.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Nombre del autor
          <input
            name="author_name"
            type="text"
            required
            maxLength={150}
            defaultValue={initialValue?.author_name}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Rol del autor
          <input
            name="author_role"
            type="text"
            maxLength={150}
            defaultValue={initialValue?.author_role ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Cliente (opcional)
          <select
            name="client_id"
            defaultValue={initialValue?.client_id ?? ""}
            className={inputClass}
          >
            <option value="">Sin cliente asociado</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Proyecto (opcional)
          <select
            name="project_id"
            defaultValue={initialValue?.project_id ?? ""}
            className={inputClass}
          >
            <option value="">Sin proyecto asociado</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Testimonio
        <textarea
          name="content"
          rows={4}
          required
          defaultValue={initialValue?.content}
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Calificación (1-5, opcional)
          <input
            name="rating"
            type="number"
            min={1}
            max={5}
            defaultValue={initialValue?.rating ?? ""}
            className={inputClass}
          />
        </label>
        <label className="flex items-center gap-2 self-end text-sm text-muted">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={initialValue?.featured}
            className="focus-ring h-4 w-4 rounded border-border"
          />
          Destacado
        </label>
      </div>

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
