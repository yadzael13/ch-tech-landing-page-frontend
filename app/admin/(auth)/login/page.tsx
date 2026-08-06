"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { siteMeta } from "@/lib/content/site";

type Status = "idle" | "submitting" | "error";

const inputClass =
  "focus-ring rounded-lg border border-border bg-surface px-4 py-2 text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent/60";

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await login(
        String(formData.get("email") ?? ""),
        String(formData.get("password") ?? ""),
      );
      router.push("/admin");
    } catch (error) {
      setStatus("error");
      if (error instanceof ApiError && error.status === 429) {
        setErrorMessage(
          "Demasiados intentos. Espera unos minutos antes de volver a intentar.",
        );
      } else if (error instanceof ApiError) {
        setErrorMessage("Email o contraseña incorrectos.");
      } else {
        setErrorMessage("No fue posible iniciar sesión. Intenta de nuevo.");
      }
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        {siteMeta.name} — Admin
      </h1>
      <p className="mt-2 text-sm text-muted">Inicia sesión para continuar.</p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-4"
        noValidate
      >
        <label className="flex flex-col gap-1 text-sm text-muted">
          Email
          <input name="email" type="email" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-muted">
          Contraseña
          <input
            name="password"
            type="password"
            required
            className={inputClass}
          />
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="focus-ring mt-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "submitting" ? "Ingresando..." : "Ingresar"}
        </button>

        {status === "error" && errorMessage && (
          <p role="alert" className="text-sm text-red-400">
            {errorMessage}
          </p>
        )}
      </form>
    </main>
  );
}
