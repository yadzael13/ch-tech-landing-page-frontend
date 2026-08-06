"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteTestimonial } from "@/lib/api/admin";
import { getTestimonials } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import { TestimonialItem } from "@/lib/api/types";

export default function AdminTestimonialsPage() {
  const { authedFetch } = useAuth();
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    // Public read (docs/API.md has no GET /admin/testimonials) — same
    // reasoning as clients/page.tsx.
    getTestimonials()
      .then((data) => {
        setTestimonials(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  async function handleDelete(testimonial: TestimonialItem) {
    if (
      !window.confirm(
        `¿Eliminar el testimonio de "${testimonial.author_name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    await deleteTestimonial(authedFetch, testimonial.id);
    setTestimonials((current) =>
      current.filter((item) => item.id !== testimonial.id),
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Testimonials
        </h1>
        <Link
          href="/admin/testimonials/new"
          className="focus-ring rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98]"
        >
          Nuevo testimonio
        </Link>
      </div>

      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar los testimonios.
        </p>
      )}

      {status === "ready" && testimonials.length === 0 && (
        <p className="mt-6 text-sm text-muted">Aún no hay testimonios.</p>
      )}

      {status === "ready" && testimonials.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Autor</th>
                <th className="px-4 py-3 font-medium">Calificación</th>
                <th className="px-4 py-3 font-medium">Destacado</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr
                  key={testimonial.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">
                    {testimonial.author_name}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {testimonial.rating ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {testimonial.featured ? "Sí" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/testimonials/${testimonial.id}/edit`}
                        className="focus-ring rounded text-accent transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(testimonial)}
                        className="focus-ring rounded text-red-400 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
