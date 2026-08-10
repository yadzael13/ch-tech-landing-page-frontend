"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminProjects } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { CaseStudyItem, CaseStudyWrite, ProjectDetail } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Textarea";
import { FORM_CONTROL_CLASS } from "@/components/ui/formControlClasses";

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
      <Field label="Proyecto">
        <select
          name="project_id"
          required
          defaultValue={initialValue?.project_id ?? ""}
          className={FORM_CONTROL_CLASS}
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
      </Field>

      <Field label="Desafío">
        <Textarea
          name="challenge"
          rows={3}
          defaultValue={initialValue?.challenge ?? ""}
        />
      </Field>

      <Field label="Solución">
        <Textarea
          name="solution"
          rows={3}
          defaultValue={initialValue?.solution ?? ""}
        />
      </Field>

      <Field label="Arquitectura">
        <Textarea
          name="architecture"
          rows={3}
          defaultValue={initialValue?.architecture ?? ""}
        />
      </Field>

      <Field label="Lecciones aprendidas">
        <Textarea
          name="lessons_learned"
          rows={3}
          defaultValue={initialValue?.lessons_learned ?? ""}
        />
      </Field>

      <Field label="Métricas (JSON)">
        <Textarea
          name="metrics"
          rows={3}
          placeholder='{"uptime": "99.9%"}'
          defaultValue={
            initialValue?.metrics
              ? JSON.stringify(initialValue.metrics, null, 2)
              : ""
          }
          className="font-mono text-xs"
        />
      </Field>

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 w-fit"
      >
        {status === "submitting" ? "Guardando..." : submitLabel}
      </Button>

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
