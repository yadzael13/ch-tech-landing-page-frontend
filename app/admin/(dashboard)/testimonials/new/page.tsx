"use client";

import TestimonialForm from "@/components/admin/TestimonialForm";
import { createTestimonial } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { TestimonialWrite } from "@/lib/api/types";

export default function NewTestimonialPage() {
  const { authedFetch } = useAuth();

  async function handleSubmit(payload: TestimonialWrite) {
    await createTestimonial(authedFetch, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Nuevo testimonio
      </h1>
      <div className="mt-6 max-w-2xl">
        <TestimonialForm
          onSubmit={handleSubmit}
          submitLabel="Crear testimonio"
        />
      </div>
    </div>
  );
}
