"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceItem, ServiceWrite } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

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

      <Field label="Descripción">
        <Textarea
          name="description"
          rows={4}
          defaultValue={initialValue?.description ?? ""}
        />
      </Field>

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
