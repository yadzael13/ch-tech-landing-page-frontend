"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteClient } from "@/lib/api/admin";
import { getClients } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import { ClientItem } from "@/lib/api/types";

export default function AdminClientsPage() {
  const { authedFetch } = useAuth();
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    // Public read (docs/API.md has no GET /admin/clients — see
    // lib/api/content.ts::getClients), same reasoning as Technology.
    getClients()
      .then((data) => {
        setClients(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  async function handleDelete(client: ClientItem) {
    if (
      !window.confirm(
        `¿Eliminar "${client.name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    await deleteClient(authedFetch, client.id);
    setClients((current) => current.filter((item) => item.id !== client.id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Clients
        </h1>
        <Link
          href="/admin/clients/new"
          className="focus-ring rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98]"
        >
          Nuevo cliente
        </Link>
      </div>

      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar los clientes.
        </p>
      )}

      {status === "ready" && clients.length === 0 && (
        <p className="mt-6 text-sm text-muted">Aún no hay clientes.</p>
      )}

      {status === "ready" && clients.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Industria</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">{client.name}</td>
                  <td className="px-4 py-3 text-muted">
                    {client.industry ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/clients/${client.id}/edit`}
                        className="focus-ring rounded text-accent transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(client)}
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
