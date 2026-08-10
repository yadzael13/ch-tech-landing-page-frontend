"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TeamMemberItem, TeamMemberWrite } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface TeamMemberFormProps {
  initialValue?: TeamMemberItem;
  onSubmit: (payload: TeamMemberWrite) => Promise<void>;
  submitLabel: string;
}

export default function TeamMemberForm({
  initialValue,
  onSubmit,
  submitLabel,
}: TeamMemberFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const payload: TeamMemberWrite = {
      user_id: String(formData.get("user_id") ?? "") || null,
      name: String(formData.get("name") ?? ""),
      role: String(formData.get("role") ?? ""),
      bio: String(formData.get("bio") ?? "") || null,
      photo: String(formData.get("photo") ?? "") || null,
      linkedin_url: String(formData.get("linkedin_url") ?? "") || null,
      github_url: String(formData.get("github_url") ?? "") || null,
      display_order: Number(formData.get("display_order") ?? 0),
      active: formData.get("active") === "on",
    };

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await onSubmit(payload);
      router.push("/admin/team");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No fue posible guardar el miembro del equipo.",
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
            maxLength={150}
            defaultValue={initialValue?.name}
          />
        </Field>
        <Field label="Rol">
          <Input
            name="role"
            type="text"
            required
            maxLength={150}
            defaultValue={initialValue?.role}
          />
        </Field>
      </div>

      <Field label="Biografía">
        <Textarea name="bio" rows={4} defaultValue={initialValue?.bio ?? ""} />
      </Field>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Foto (URL)">
          <Input
            name="photo"
            type="url"
            defaultValue={initialValue?.photo ?? ""}
          />
        </Field>
        <Field label="Usuario vinculado (ID, opcional)">
          <Input
            name="user_id"
            type="text"
            defaultValue={initialValue?.user_id ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="LinkedIn">
          <Input
            name="linkedin_url"
            type="url"
            defaultValue={initialValue?.linkedin_url ?? ""}
          />
        </Field>
        <Field label="GitHub">
          <Input
            name="github_url"
            type="url"
            defaultValue={initialValue?.github_url ?? ""}
          />
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Orden">
          <Input
            name="display_order"
            type="number"
            defaultValue={initialValue?.display_order ?? 0}
          />
        </Field>
        <label className="flex items-center gap-2 self-end text-sm text-muted">
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
