"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteClient } from "@/lib/api/admin";
import { getClients } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import { ClientItem } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

export default function AdminClientsPage() {
  const { authedFetch } = useAuth();
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [pendingDelete, setPendingDelete] = useState<ClientItem | null>(null);

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

  async function confirmDelete() {
    if (!pendingDelete) return;
    await deleteClient(authedFetch, pendingDelete.id);
    setClients((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    );
    setPendingDelete(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Clients
        </h1>
        <Button href="/admin/clients/new" size="sm">
          Nuevo cliente
        </Button>
      </div>

      {status === "loading" && <SkeletonTable columns={3} />}

      {status === "error" && (
        <ErrorState message="No fue posible cargar los clientes." />
      )}

      {status === "ready" && clients.length === 0 && (
        <EmptyState message="Aún no hay clientes." />
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
                        onClick={() => setPendingDelete(client)}
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
        title="¿Eliminar cliente?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" se eliminará. Esta acción no se puede deshacer.`
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
