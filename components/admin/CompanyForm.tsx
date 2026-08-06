"use client";

import { FormEvent, useState } from "react";
import { CompanyItem, CompanyWrite } from "@/lib/api/types";

const inputClass =
  "focus-ring rounded-lg border border-border bg-surface px-4 py-2 text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent/60";

interface CompanyFormProps {
  initialValue: CompanyItem | null;
  onSubmit: (payload: CompanyWrite) => Promise<void>;
  submitLabel: string;
}

export default function CompanyForm({
  initialValue,
  onSubmit,
  submitLabel,
}: CompanyFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error" | "saved">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const socialLinksRaw = String(formData.get("social_links") ?? "").trim();

    let socialLinks: Record<string, unknown> | null = null;
    if (socialLinksRaw) {
      try {
        socialLinks = JSON.parse(socialLinksRaw);
      } catch {
        setStatus("error");
        setErrorMessage(
          'Redes sociales debe ser JSON válido, ej. {"linkedin": "https://..."}',
        );
        return;
      }
    }

    const payload: CompanyWrite = {
      legal_name: String(formData.get("legal_name") ?? ""),
      display_name: String(formData.get("display_name") ?? ""),
      tagline: String(formData.get("tagline") ?? "") || null,
      mission: String(formData.get("mission") ?? "") || null,
      vision: String(formData.get("vision") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      address: String(formData.get("address") ?? "") || null,
      social_links: socialLinks,
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await onSubmit(payload);
      setStatus("saved");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible guardar los datos de la empresa.",
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Razón social
          <input
            name="legal_name"
            type="text"
            required
            maxLength={255}
            defaultValue={initialValue?.legal_name}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Nombre público
          <input
            name="display_name"
            type="text"
            required
            maxLength={150}
            defaultValue={initialValue?.display_name}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Tagline
        <input
          name="tagline"
          type="text"
          maxLength={255}
          defaultValue={initialValue?.tagline ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Misión
        <textarea
          name="mission"
          rows={3}
          defaultValue={initialValue?.mission ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Visión
        <textarea
          name="vision"
          rows={3}
          defaultValue={initialValue?.vision ?? ""}
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Email
          <input
            name="email"
            type="email"
            defaultValue={initialValue?.email ?? ""}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Teléfono
          <input
            name="phone"
            type="text"
            maxLength={50}
            defaultValue={initialValue?.phone ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Dirección
        <input
          name="address"
          type="text"
          defaultValue={initialValue?.address ?? ""}
          className={inputClass}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Redes sociales (JSON)
        <textarea
          name="social_links"
          rows={3}
          placeholder='{"linkedin": "https://linkedin.com/company/ch-tech"}'
          defaultValue={
            initialValue?.social_links
              ? JSON.stringify(initialValue.social_links, null, 2)
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

      {status === "saved" && (
        <p className="text-sm text-accent">Cambios guardados.</p>
      )}

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
