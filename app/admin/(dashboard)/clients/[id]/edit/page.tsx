"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ClientForm from "@/components/admin/ClientForm";
import { updateClient } from "@/lib/api/admin";
import { getClients } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import { ClientItem, ClientWrite } from "@/lib/api/types";

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>();
  const { authedFetch } = useAuth();
  const [client, setClient] = useState<ClientItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    // docs/API.md has no GET /clients/{id} or GET /admin/clients/{id} — the
    // edit form reads the same public list the management table uses and
    // picks the matching row (same reasoning as clients/page.tsx).
    getClients()
      .then((data) => {
        const match = data.find((item) => item.id === id);
        if (!match) {
          setStatus("error");
          return;
        }
        setClient(match);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [id]);

  async function handleSubmit(payload: ClientWrite) {
    await updateClient(authedFetch, id, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Editar cliente
      </h1>

      {status === "loading" && (
        <p className="mt-6 text-sm text-muted">Cargando...</p>
      )}
      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar el cliente.
        </p>
      )}
      {status === "ready" && client && (
        <div className="mt-6 max-w-2xl">
          <ClientForm
            initialValue={client}
            onSubmit={handleSubmit}
            submitLabel="Guardar cambios"
          />
        </div>
      )}
    </div>
  );
}
