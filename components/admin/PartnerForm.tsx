"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { PartnerItem, PartnerWrite } from "@/lib/api/types";

const inputClass =
  "focus-ring rounded-lg border border-border bg-surface px-4 py-2 text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent/60";

interface PartnerFormProps {
  initialValue?: PartnerItem;
  onSubmit: (payload: PartnerWrite) => Promise<void>;
  submitLabel: string;
}

export default function PartnerForm({
  initialValue,
  onSubmit,
  submitLabel,
}: PartnerFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload: PartnerWrite = {
      name: String(formData.get("name") ?? ""),
      logo: String(formData.get("logo") ?? "") || null,
      partnership_type: String(formData.get("partnership_type") ?? "") || null,
      website_url: String(formData.get("website_url") ?? "") || null,
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await onSubmit(payload);
      router.push("/admin/partners");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el partner.",
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
          Tipo de alianza
          <input
            name="partnership_type"
            type="text"
            maxLength={100}
            defaultValue={initialValue?.partnership_type ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Logo (URL)
          <input
            name="logo"
            type="url"
            defaultValue={initialValue?.logo ?? ""}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Sitio web
          <input
            name="website_url"
            type="url"
            defaultValue={initialValue?.website_url ?? ""}
            className={inputClass}
          />
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
