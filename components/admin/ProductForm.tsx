"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductItem, ProductWrite } from "@/lib/api/types";

const inputClass =
  "focus-ring rounded-lg border border-border bg-surface px-4 py-2 text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent/60";

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
      short_description: String(formData.get("short_description") ?? "") || null,
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
        <label className="flex flex-col gap-1 text-sm text-muted">
          Nombre
          <input
            name="name"
            type="text"
            required
            maxLength={255}
            defaultValue={initialValue?.name}
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
          URL
          <input
            name="url"
            type="url"
            defaultValue={initialValue?.url ?? ""}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Logo (URL)
          <input
            name="logo"
            type="url"
            defaultValue={initialValue?.logo ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Estado
          <select
            name="status"
            defaultValue={initialValue?.status ?? "WAITLIST"}
            className={inputClass}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
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
