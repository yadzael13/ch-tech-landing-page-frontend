"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ClientItem, ClientWrite } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

interface ClientFormProps {
  initialValue?: ClientItem;
  onSubmit: (payload: ClientWrite) => Promise<void>;
  submitLabel: string;
}

export default function ClientForm({
  initialValue,
  onSubmit,
  submitLabel,
}: ClientFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload: ClientWrite = {
      name: String(formData.get("name") ?? ""),
      logo: String(formData.get("logo") ?? "") || null,
      industry: String(formData.get("industry") ?? "") || null,
      website_url: String(formData.get("website_url") ?? "") || null,
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await onSubmit(payload);
      router.push("/admin/clients");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el cliente.",
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
        <Field label="Industria">
          <Input
            name="industry"
            type="text"
            maxLength={150}
            defaultValue={initialValue?.industry ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Logo (URL)">
          <Input
            name="logo"
            type="url"
            defaultValue={initialValue?.logo ?? ""}
          />
        </Field>
        <Field label="Sitio web">
          <Input
            name="website_url"
            type="url"
            defaultValue={initialValue?.website_url ?? ""}
          />
        </Field>
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
