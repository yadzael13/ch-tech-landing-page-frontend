"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceItem, ServiceWrite } from "@/lib/api/types";

const inputClass =
  "focus-ring rounded-lg border border-border bg-surface px-4 py-2 text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent/60";

interface ServiceFormProps {
  initialValue?: ServiceItem;
  onSubmit: (payload: ServiceWrite) => Promise<void>;
  submitLabel: string;
}

export default function ServiceForm({
  initialValue,
  onSubmit,
  submitLabel,
}: ServiceFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload: ServiceWrite = {
      slug: String(formData.get("slug") ?? ""),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? "") || null,
      featured: formData.get("featured") === "on",
      active: formData.get("active") === "on",
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await onSubmit(payload);
      router.push("/admin/services");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el servicio.",
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
        Descripción
        <textarea
          name="description"
          rows={4}
          defaultValue={initialValue?.description ?? ""}
          className={inputClass}
        />
      </label>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            name="featured"
            type="checkbox"
            defaultChecked={initialValue?.featured}
            className="focus-ring h-4 w-4 rounded border-border"
          />
          Destacado
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            name="active"
            type="checkbox"
            defaultChecked={initialValue?.active ?? true}
            className="focus-ring h-4 w-4 rounded border-border"
          />
          Activo
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
