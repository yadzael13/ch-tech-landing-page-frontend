"use client";

import { FormEvent, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { submitContact } from "@/lib/api/content";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

type Status = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const message = String(formData.get("message") ?? "");

    setMessageError(null);
    setErrorMessage(null);

    // Mirrors docs/API.md "Validation Rules" -> Contact, so obviously invalid
    // input never round-trips to the API just to be rejected.
    if (message.length < 20 || message.length > 5000) {
      setStatus("error");
      setMessageError("El mensaje debe tener entre 20 y 5000 caracteres.");
      return;
    }

    setStatus("submitting");

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
          <Field label="Nombre">
            <Input name="name" type="text" required maxLength={255} />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" required />
          </Field>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Empresa (opcional)">
            <Input name="company" type="text" maxLength={255} />
          </Field>
          <Field label="Asunto (opcional)">
            <Input name="subject" type="text" maxLength={255} />
          </Field>
        </div>

        <Field label="Mensaje" error={messageError ?? undefined}>
          <Textarea
            name="message"
            required
            minLength={20}
            maxLength={5000}
            rows={5}
          />
        </Field>

        <Button
          type="submit"
          disabled={status === "submitting"}
          className="mt-2 w-fit"
        >
          {status === "submitting" ? "Enviando..." : "Enviar mensaje"}
        </Button>

        {status === "success" && (
          <p
            role="status"
            className="translate-y-0 text-sm text-accent opacity-100 transition-[opacity,transform] duration-200 ease-out starting:translate-y-1 starting:opacity-0"
          >
            Mensaje enviado. Te responderemos pronto.
          </p>
        )}
        {status === "error" && errorMessage && (
          <p
            role="alert"
            className="translate-y-0 text-sm text-danger opacity-100 transition-[opacity,transform] duration-200 ease-out starting:translate-y-1 starting:opacity-0"
          >
            {errorMessage}
          </p>
        )}
      </form>
    </section>
  );
}
