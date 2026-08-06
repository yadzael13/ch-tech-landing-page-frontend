"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { deleteTeamMember, getAdminTeamMembers } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { TeamMemberItem } from "@/lib/api/types";

export default function AdminTeamPage() {
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
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

  async function handleDelete(member: TeamMemberItem) {
    if (
      !window.confirm(
        `¿Eliminar "${member.name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }
    await deleteTeamMember(authedFetch, member.id);
    setMembers((current) => current.filter((item) => item.id !== member.id));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
          Team
        </h1>
        <Link
          href="/admin/team/new"
          className="focus-ring rounded-full bg-accent px-4 py-2 text-sm font-medium text-background transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:shadow-[0_0_24px_-6px_var(--color-accent)] active:scale-[0.98]"
        >
          Nuevo miembro
        </Link>
      </div>

      {status === "error" && (
        <p className="mt-6 text-sm text-red-400">
          No fue posible cargar el equipo.
        </p>
      )}

      {status === "ready" && members.length === 0 && (
        <p className="mt-6 text-sm text-muted">Aún no hay miembros.</p>
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
                        onClick={() => handleDelete(member)}
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
