"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductItem, ProductWrite } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { FORM_CONTROL_CLASS } from "@/components/ui/formControlClasses";

const STATUS_OPTIONS = ["WAITLIST", "BETA", "LIVE"];

interface ProductFormProps {
  initialValue?: ProductItem;
  onSubmit: (payload: ProductWrite) => Promise<void>;
  submitLabel: string;
}

export default function ProductForm({
  initialValue,
  onSubmit,
  submitLabel,
}: ProductFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload: ProductWrite = {
      slug: String(formData.get("slug") ?? ""),
      name: String(formData.get("name") ?? ""),
      short_description:
        String(formData.get("short_description") ?? "") || null,
      full_description: String(formData.get("full_description") ?? "") || null,
      status: String(formData.get("status") ?? "WAITLIST"),
      url: String(formData.get("url") ?? "") || null,
      logo: String(formData.get("logo") ?? "") || null,
      featured: formData.get("featured") === "on",
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await onSubmit(payload);
      router.push("/admin/products");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el producto.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nombre">
          <Input
            name="name"
            type="text"
            required
            maxLength={255}
            defaultValue={initialValue?.name}
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
        <Field label="URL">
          <Input name="url" type="url" defaultValue={initialValue?.url ?? ""} />
        </Field>
        <Field label="Logo (URL)">
          <Input
            name="logo"
            type="url"
            defaultValue={initialValue?.logo ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Estado">
          <select
            name="status"
            defaultValue={initialValue?.status ?? "WAITLIST"}
            className={FORM_CONTROL_CLASS}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
