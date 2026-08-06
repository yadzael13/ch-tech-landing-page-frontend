"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminProjects } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { CaseStudyItem, CaseStudyWrite, ProjectDetail } from "@/lib/api/types";

const inputClass =
  "focus-ring rounded-lg border border-border bg-surface px-4 py-2 text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent/60";

interface CaseStudyFormProps {
  initialValue?: CaseStudyItem;
  onSubmit: (payload: CaseStudyWrite) => Promise<void>;
  submitLabel: string;
}

export default function CaseStudyForm({
  initialValue,
  onSubmit,
  submitLabel,
}: CaseStudyFormProps) {
  const router = useRouter();
  const { authedFetch } = useAuth();
  const [projects, setProjects] = useState<ProjectDetail[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Admin-only list (not the public one): a case study can point at a
    // PRIVATE project, which the public project list would hide from here.
    getAdminProjects(authedFetch)
      .then(setProjects)
      .catch(() => setProjects([]));
  }, [authedFetch]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const metricsRaw = String(formData.get("metrics") ?? "").trim();

    let metrics: Record<string, unknown> | null = null;
    if (metricsRaw) {
      try {
        metrics = JSON.parse(metricsRaw);
      } catch {
        setStatus("error");
        setErrorMessage(
          'Metrics debe ser JSON válido, ej. {"uptime": "99.9%"}',
        );
        return;
      }
    }

    const payload: CaseStudyWrite = {
      project_id: String(formData.get("project_id") ?? ""),
      challenge: String(formData.get("challenge") ?? "") || null,
      solution: String(formData.get("solution") ?? "") || null,
      architecture: String(formData.get("architecture") ?? "") || null,
      lessons_learned: String(formData.get("lessons_learned") ?? "") || null,
      metrics,
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await onSubmit(payload);
      router.push("/admin/case-studies");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el caso de estudio.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <label className="flex flex-col gap-1 text-sm text-muted">
        Proyecto
        <select
          name="project_id"
          required
          defaultValue={initialValue?.project_id ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Selecciona un proyecto
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Desafío
        <textarea
          name="challenge"
          rows={3}
          defaultValue={initialValue?.challenge ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Solución
        <textarea
          name="solution"
          rows={3}
          defaultValue={initialValue?.solution ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Arquitectura
        <textarea
          name="architecture"
          rows={3}
          defaultValue={initialValue?.architecture ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Lecciones aprendidas
        <textarea
          name="lessons_learned"
          rows={3}
          defaultValue={initialValue?.lessons_learned ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Métricas (JSON)
        <textarea
          name="metrics"
          rows={3}
          placeholder='{"uptime": "99.9%"}'
          defaultValue={
            initialValue?.metrics
              ? JSON.stringify(initialValue.metrics, null, 2)
              : ""
          }
          className={`${inputClass} font-mono text-xs`}
        />
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
