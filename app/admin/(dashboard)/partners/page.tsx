"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deletePartner } from "@/lib/api/admin";
import { getPartners } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import { PartnerItem } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

export default function AdminPartnersPage() {
  const { authedFetch } = useAuth();
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [pendingDelete, setPendingDelete] = useState<PartnerItem | null>(null);

  useEffect(() => {
    // Public read (docs/API.md has no GET /admin/partners) — same reasoning
    // as clients/page.tsx.
    getPartners()
      .then((data) => {
        setPartners(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  async function confirmDelete() {
    if (!pendingDelete) return;
    await deletePartner(authedFetch, pendingDelete.id);
    setPartners((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    );
    setPendingDelete(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Partners
        </h1>
        <Button href="/admin/partners/new" size="sm">
          Nuevo partner
        </Button>
      </div>

      {status === "loading" && <SkeletonTable columns={3} />}

      {status === "error" && (
        <ErrorState message="No fue posible cargar los partners." />
      )}

      {status === "ready" && partners.length === 0 && (
        <EmptyState message="Aún no hay partners." />
      )}

      {status === "ready" && partners.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Tipo</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((partner) => (
                <tr
                  key={partner.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">{partner.name}</td>
                  <td className="px-4 py-3 text-muted">
                    {partner.partnership_type ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/partners/${partner.id}/edit`}
                        className="focus-ring rounded text-accent transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(partner)}
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
        title="¿Eliminar partner?"
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
