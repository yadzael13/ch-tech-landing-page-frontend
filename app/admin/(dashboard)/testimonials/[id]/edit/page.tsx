"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { updateTestimonial } from "@/lib/api/admin";
import { getTestimonials } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import { TestimonialItem, TestimonialWrite } from "@/lib/api/types";

export default function EditTestimonialPage() {
  const { id } = useParams<{ id: string }>();
  const { authedFetch } = useAuth();
  const [testimonial, setTestimonial] = useState<TestimonialItem | null>(
    null,
  );
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    // docs/API.md has no GET /testimonials/{id} or GET /admin/testimonials/{id}
    // — read the same public list the management table uses and pick the
    // matching row (same reasoning as clients/[id]/edit/page.tsx).
    getTestimonials()
      .then((data) => {
        const match = data.find((item) => item.id === id);
        if (!match) {
          setStatus("error");
          return;
        }
        setTestimonial(match);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  async function handleSubmit(payload: TestimonialWrite) {
    await updateTestimonial(authedFetch, id, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Editar testimonio
      </h1>

      {status === "loading" && (
        <p className="mt-6 text-sm text-muted">Cargando...</p>
      )}
      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar el testimonio.
        </p>
      )}
      {status === "ready" && testimonial && (
        <div className="mt-6 max-w-2xl">
          <TestimonialForm
            initialValue={testimonial}
            onSubmit={handleSubmit}
            submitLabel="Guardar cambios"
          />
        </div>
      )}
    </div>
  );
}
