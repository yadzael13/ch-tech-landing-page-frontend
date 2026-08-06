"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deletePartner } from "@/lib/api/admin";
import { getPartners } from "@/lib/api/content";
import { useAuth } from "@/lib/auth/AuthContext";
import { PartnerItem } from "@/lib/api/types";

export default function AdminPartnersPage() {
  const { authedFetch } = useAuth();
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

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

  async function handleDelete(partner: PartnerItem) {
    if (
      !window.confirm(
        `¿Eliminar "${partner.name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    await deletePartner(authedFetch, partner.id);
    setPartners((current) =>
      current.filter((item) => item.id !== partner.id),
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Partners
        </h1>
        <Link
          href="/admin/partners/new"
          className="focus-ring rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98]"
        >
          Nuevo partner
        </Link>
      </div>

      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar los partners.
        </p>
      )}

      {status === "ready" && partners.length === 0 && (
        <p className="mt-6 text-sm text-muted">Aún no hay partners.</p>
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
                  <td className="px-4 py-3 text-foreground">
                    {partner.name}
                  </td>
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
                        onClick={() => handleDelete(partner)}
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
