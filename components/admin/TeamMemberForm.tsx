"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { TeamMemberItem, TeamMemberWrite } from "@/lib/api/types";

const inputClass =
  "focus-ring rounded-lg border border-border bg-surface px-4 py-2 text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent/60";

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
        <label className="flex flex-col gap-1 text-sm text-muted">
          Nombre
          <input
            name="name"
            type="text"
            required
            maxLength={150}
            defaultValue={initialValue?.name}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Rol
          <input
            name="role"
            type="text"
            required
            maxLength={150}
            defaultValue={initialValue?.role}
            className={inputClass}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Biografía
        <textarea
          name="bio"
          rows={4}
          defaultValue={initialValue?.bio ?? ""}
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Foto (URL)
          <input
            name="photo"
            type="url"
            defaultValue={initialValue?.photo ?? ""}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Usuario vinculado (ID, opcional)
          <input
            name="user_id"
            type="text"
            defaultValue={initialValue?.user_id ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          LinkedIn
          <input
            name="linkedin_url"
            type="url"
            defaultValue={initialValue?.linkedin_url ?? ""}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          GitHub
          <input
            name="github_url"
            type="url"
            defaultValue={initialValue?.github_url ?? ""}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-muted">
          Orden
          <input
            name="display_order"
            type="number"
            defaultValue={initialValue?.display_order ?? 0}
            className={inputClass}
          />
        </label>
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
