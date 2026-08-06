"use client";

import { FormEvent, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { submitContact } from "@/lib/api/content";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "focus-ring rounded-lg border border-border bg-surface px-4 py-2 text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out placeholder:text-muted hover:border-accent/60";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const message = String(formData.get("message") ?? "");

    // Mirrors docs/API.md "Validation Rules" -> Contact, so obviously invalid
    // input never round-trips to the API just to be rejected.
    if (message.length < 20 || message.length > 5000) {
      setStatus("error");
      setErrorMessage("El mensaje debe tener entre 20 y 5000 caracteres.");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);

    try {
      await submitContact({
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        company: String(formData.get("company") ?? "") || undefined,
        subject: String(formData.get("subject") ?? "") || undefined,
        message,
      });
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      if (error instanceof ApiError && error.status === 429) {
        setErrorMessage(
          "Has alcanzado el límite de solicitudes. Intenta de nuevo más tarde.",
        );
      } else if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("No fue posible enviar el mensaje. Intenta de nuevo.");
      }
    }
  }

  return (
    <section id="contacto" className="mx-auto max-w-2xl px-6 py-24">
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground">
        Contacto
      </h2>
      <p className="mt-4 text-muted">
        ¿Tienes un proyecto en mente? Cuéntanos los detalles.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-4"
        noValidate
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-muted">
            Nombre
            <input
              name="name"
              type="text"
              required
              maxLength={255}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-muted">
            Email
            <input name="email" type="email" required className={inputClass} />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-muted">
            Empresa (opcional)
            <input
              name="company"
              type="text"
              maxLength={255}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-muted">
            Asunto (opcional)
            <input
              name="subject"
              type="text"
              maxLength={255}
              className={inputClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm text-muted">
          Mensaje
          <textarea
            name="message"
            required
            minLength={20}
            maxLength={5000}
            rows={5}
            className={inputClass}
          />
        </label>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="focus-ring mt-2 w-fit rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
        >
          {status === "submitting" ? "Enviando..." : "Enviar mensaje"}
        </button>

        {status === "success" && (
          <p role="status" className="text-sm text-accent">
            Mensaje enviado. Te responderemos pronto.
          </p>
        )}
        {status === "error" && errorMessage && (
          <p role="alert" className="text-sm text-red-400">
            {errorMessage}
          </p>
        )}
      </form>
    </section>
  );
}
