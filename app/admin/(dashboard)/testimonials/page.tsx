"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteTestimonial } from "@/lib/api/admin";
import { getTestimonials } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import { TestimonialItem } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

export default function AdminTestimonialsPage() {
  const { authedFetch } = useAuth();
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [pendingDelete, setPendingDelete] = useState<TestimonialItem | null>(
    null,
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

  async function confirmDelete() {
    if (!pendingDelete) return;
    await deleteTestimonial(authedFetch, pendingDelete.id);
    setTestimonials((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    );
    setPendingDelete(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Testimonials
        </h1>
        <Button href="/admin/testimonials/new" size="sm">
          Nuevo testimonio
        </Button>
      </div>

      {status === "loading" && <SkeletonTable columns={4} />}

      {status === "error" && (
        <ErrorState message="No fue posible cargar los testimonios." />
      )}

      {status === "ready" && testimonials.length === 0 && (
        <EmptyState message="Aún no hay testimonios." />
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
                        onClick={() => setPendingDelete(testimonial)}
                        className="focus-ring rounded text-danger transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
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

      <Dialog
        open={pendingDelete !== null}
        title="¿Eliminar testimonio?"
        description={
          pendingDelete
            ? `El testimonio de "${pendingDelete.author_name}" se eliminará. Esta acción no se puede deshacer.`
            : undefined
        }
        confirmLabel="Eliminar"
        destructive
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
