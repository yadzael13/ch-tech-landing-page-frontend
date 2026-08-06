"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteService, getAdminServices } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { ServiceItem } from "@/lib/api/types";

export default function AdminServicesPage() {
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    // Wait for AuthContext's own mount-time silent refresh to settle first —
    // see the same comment in projects/page.tsx. The .then()/.catch() chain
    // keeps every setState call lexically deferred, which
    // eslint-plugin-react-hooks' set-state-in-effect rule requires.
    if (isAuthLoading) {
      return;
    }
    getAdminServices(authedFetch)
      .then((data) => {
        setServices(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [isAuthLoading, authedFetch]);

  async function handleDelete(service: ServiceItem) {
    if (
      !window.confirm(
        `¿Eliminar "${service.title}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    await deleteService(authedFetch, service.id);
    setServices((current) => current.filter((item) => item.id !== service.id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Services
        </h1>
        <Link
          href="/admin/services/new"
          className="focus-ring rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98]"
        >
          Nuevo servicio
        </Link>
      </div>

      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar los servicios.
        </p>
      )}

      {status === "ready" && services.length === 0 && (
        <p className="mt-6 text-sm text-muted">Aún no hay servicios.</p>
      )}

      {status === "ready" && services.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Título</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Destacado</th>
                <th className="px-4 py-3 font-medium">Activo</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">{service.title}</td>
                  <td className="px-4 py-3 text-muted">{service.slug}</td>
                  <td className="px-4 py-3 text-muted">
                    {service.featured ? "Sí" : "No"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {service.active ? "Sí" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="focus-ring rounded text-accent transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(service)}
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
