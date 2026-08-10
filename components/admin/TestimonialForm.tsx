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
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FORM_CONTROL_CLASS } from "@/components/ui/formControlClasses";

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
        <Field label="Nombre del autor">
          <Input
            name="author_name"
            type="text"
            required
            maxLength={150}
            defaultValue={initialValue?.author_name}
          />
        </Field>
        <Field label="Rol del autor">
          <Input
            name="author_role"
            type="text"
            maxLength={150}
            defaultValue={initialValue?.author_role ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Cliente (opcional)">
          <select
            name="client_id"
            defaultValue={initialValue?.client_id ?? ""}
            className={FORM_CONTROL_CLASS}
          >
            <option value="">Sin cliente asociado</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Proyecto (opcional)">
          <select
            name="project_id"
            defaultValue={initialValue?.project_id ?? ""}
            className={FORM_CONTROL_CLASS}
          >
            <option value="">Sin proyecto asociado</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Testimonio">
        <Textarea
          name="content"
          rows={4}
          required
          defaultValue={initialValue?.content}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Calificación (1-5, opcional)">
          <Input
            name="rating"
            type="number"
            min={1}
            max={5}
            defaultValue={initialValue?.rating ?? ""}
          />
        </Field>
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
