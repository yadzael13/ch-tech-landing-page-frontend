"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getTechnologies } from "@/lib/api/content";
import { ProjectDetail, ProjectWrite, TechnologyItem } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FORM_CONTROL_CLASS } from "@/components/ui/formControlClasses";
import { cx } from "@/lib/cx";

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
        <Field label="Título">
          <Input
            name="title"
            type="text"
            required
            maxLength={255}
            defaultValue={initialValue?.title}
          />
        </Field>
        <Field label="Slug">
          <Input
            name="slug"
            type="text"
            required
            maxLength={150}
            defaultValue={initialValue?.slug}
          />
        </Field>
      </div>

      <Field label="Descripción corta">
        <Input
          name="short_description"
          type="text"
          defaultValue={initialValue?.short_description ?? ""}
        />
      </Field>

      <Field label="Descripción completa">
        <Textarea
          name="full_description"
          rows={5}
          defaultValue={initialValue?.full_description ?? ""}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Repositorio">
          <Input
            name="repository_url"
            type="url"
            defaultValue={initialValue?.repository_url ?? ""}
          />
        </Field>
        <Field label="Demo en vivo">
          <Input
            name="live_demo_url"
            type="url"
            defaultValue={initialValue?.live_demo_url ?? ""}
          />
        </Field>
      </div>

      <Field label="Imagen de portada (URL)">
        <Input
          name="cover_image"
          type="url"
          defaultValue={initialValue?.cover_image ?? ""}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Estado">
          <select
            name="status"
            defaultValue={initialValue?.status ?? "PLANNING"}
            className={FORM_CONTROL_CLASS}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Visibilidad">
          <select
            name="visibility"
            defaultValue={initialValue?.visibility ?? "PRIVATE"}
            className={FORM_CONTROL_CLASS}
          >
            {VISIBILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Inicio">
          <Input
            name="started_at"
            type="date"
            defaultValue={initialValue?.started_at ?? ""}
          />
        </Field>
        <Field label="Fin">
          <Input
            name="finished_at"
            type="date"
            defaultValue={initialValue?.finished_at ?? ""}
          />
        </Field>
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

      <Field label="Tecnologías">
        <select
          name="technology_ids"
          multiple
          defaultValue={initialValue?.technologies.map((tech) => tech.id) ?? []}
          className={cx(FORM_CONTROL_CLASS, "h-32")}
        >
          {technologies.map((technology) => (
            <option key={technology.id} value={technology.id}>
              {technology.name}
            </option>
          ))}
        </select>
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
