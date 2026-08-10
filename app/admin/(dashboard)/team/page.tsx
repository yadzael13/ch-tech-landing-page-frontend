"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteTeamMember, getAdminTeamMembers } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { TeamMemberItem } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonTable } from "@/components/ui/SkeletonTable";

export default function AdminTeamPage() {
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [pendingDelete, setPendingDelete] = useState<TeamMemberItem | null>(
    null,
  );

  useEffect(() => {
    // Wait for AuthContext's own mount-time silent refresh to settle first —
    // see the same comment in projects/page.tsx.
    if (isAuthLoading) {
      return;
    }
    getAdminTeamMembers(authedFetch)
      .then((data) => {
        setMembers(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [isAuthLoading, authedFetch]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    await deleteTeamMember(authedFetch, pendingDelete.id);
    setMembers((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    );
    setPendingDelete(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Team
        </h1>
        <Button href="/admin/team/new" size="sm">
          Nuevo miembro
        </Button>
      </div>

      {status === "loading" && <SkeletonTable columns={5} />}

      {status === "error" && (
        <ErrorState message="No fue posible cargar el equipo." />
      )}

      {status === "ready" && members.length === 0 && (
        <EmptyState message="Aún no hay miembros." />
      )}

      {status === "ready" && members.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Rol</th>
                <th className="px-4 py-3 font-medium">Orden</th>
                <th className="px-4 py-3 font-medium">Activo</th>
                <th className="px-4 py-3 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-3 text-foreground">{member.name}</td>
                  <td className="px-4 py-3 text-muted">{member.role}</td>
                  <td className="px-4 py-3 text-muted">
                    {member.display_order}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {member.active ? "Sí" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-4">
                      <Link
                        href={`/admin/team/${member.id}/edit`}
                        className="focus-ring rounded text-accent transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:opacity-80"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(member)}
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
        title="¿Eliminar miembro?"
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
