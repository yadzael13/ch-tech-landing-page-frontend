"use client";

import { FormEvent, useState } from "react";
import { CompanyItem, CompanyWrite } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

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
  const [status, setStatus] = useState<
    "idle" | "submitting" | "error" | "saved"
  >("idle");
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
        <Field label="Razón social">
          <Input
            name="legal_name"
            type="text"
            required
            maxLength={255}
            defaultValue={initialValue?.legal_name}
          />
        </Field>
        <Field label="Nombre público">
          <Input
            name="display_name"
            type="text"
            required
            maxLength={150}
            defaultValue={initialValue?.display_name}
          />
        </Field>
      </div>

      <Field label="Tagline">
        <Input
          name="tagline"
          type="text"
          maxLength={255}
          defaultValue={initialValue?.tagline ?? ""}
        />
      </Field>

      <Field label="Misión">
        <Textarea
          name="mission"
          rows={3}
          defaultValue={initialValue?.mission ?? ""}
        />
      </Field>

      <Field label="Visión">
        <Textarea
          name="vision"
          rows={3}
          defaultValue={initialValue?.vision ?? ""}
        />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Email">
          <Input
            name="email"
            type="email"
            defaultValue={initialValue?.email ?? ""}
          />
        </Field>
        <Field label="Teléfono">
          <Input
            name="phone"
            type="text"
            maxLength={50}
            defaultValue={initialValue?.phone ?? ""}
          />
        </Field>
      </div>

      <Field label="Dirección">
        <Input
          name="address"
          type="text"
          defaultValue={initialValue?.address ?? ""}
        />
      </Field>

      <Field label="Redes sociales (JSON)">
        <Textarea
          name="social_links"
          rows={3}
          placeholder='{"linkedin": "https://linkedin.com/company/ch-tech"}'
          defaultValue={
            initialValue?.social_links
              ? JSON.stringify(initialValue.social_links, null, 2)
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

      {status === "saved" && (
        <p role="status" className="text-sm text-accent">
          Cambios guardados.
        </p>
      )}

      {status === "error" && errorMessage && (
        <p role="alert" className="text-sm text-danger">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
