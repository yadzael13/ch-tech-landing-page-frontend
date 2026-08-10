"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TechnologyItem, TechnologyWrite } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

interface TechnologyFormProps {
  initialValue?: TechnologyItem;
  onSubmit: (payload: TechnologyWrite) => Promise<void>;
  submitLabel: string;
}

export default function TechnologyForm({
  initialValue,
  onSubmit,
  submitLabel,
}: TechnologyFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload: TechnologyWrite = {
      name: String(formData.get("name") ?? ""),
      category: String(formData.get("category") ?? "") || null,
      icon: String(formData.get("icon") ?? "") || null,
      official_url: String(formData.get("official_url") ?? "") || null,
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await onSubmit(payload);
      router.push("/admin/technologies");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible guardar la tecnología.",
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
            maxLength={100}
            defaultValue={initialValue?.name}
          />
        </Field>
        <Field label="Categoría">
          <Input
            name="category"
            type="text"
            maxLength={100}
            defaultValue={initialValue?.category ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Ícono (URL)">
          <Input
            name="icon"
            type="url"
            defaultValue={initialValue?.icon ?? ""}
          />
        </Field>
        <Field label="Sitio oficial">
          <Input
            name="official_url"
            type="url"
            defaultValue={initialValue?.official_url ?? ""}
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
