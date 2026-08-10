"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/AuthContext";
import { siteMeta } from "@/lib/content/site";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

type Status = "idle" | "submitting" | "error";

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
      <Card className="shadow-[var(--shadow-elevated)]">
        <div
          aria-hidden="true"
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-background"
        >
          <span className="font-[family-name:var(--font-display)] text-lg font-bold">
            CH
          </span>
        </div>

        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          {siteMeta.name} — Admin
        </h1>
        <p className="mt-2 text-sm text-muted">Inicia sesión para continuar.</p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-4"
          noValidate
        >
          <Field label="Email">
            <Input name="email" type="email" required />
          </Field>
          <Field label="Contraseña">
            <Input name="password" type="password" required />
          </Field>

          <Button
            type="submit"
            disabled={status === "submitting"}
            className="mt-2"
          >
            {status === "submitting" ? "Ingresando..." : "Ingresar"}
          </Button>

          {status === "error" && errorMessage && (
            <p role="alert" className="text-sm text-danger">
              {errorMessage}
            </p>
          )}
        </form>
      </Card>
    </main>
  );
}
