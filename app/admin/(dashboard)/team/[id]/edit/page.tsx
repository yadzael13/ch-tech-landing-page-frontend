"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TeamMemberForm from "@/components/admin/TeamMemberForm";
import { getAdminTeamMember, updateTeamMember } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { TeamMemberItem, TeamMemberWrite } from "@/lib/api/types";
import { ErrorState } from "@/components/ui/ErrorState";
import { SkeletonForm } from "@/components/ui/SkeletonForm";

export default function EditTeamMemberPage() {
  const { id } = useParams<{ id: string }>();
  const { authedFetch, isLoading: isAuthLoading } = useAuth();
  const [member, setMember] = useState<TeamMemberItem | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    // Wait for the mount-time silent refresh to settle first — see the same
    // comment in team/page.tsx.
    if (isAuthLoading) {
      return;
    }
    getAdminTeamMember(authedFetch, id)
      .then((data) => {
        setMember(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, [authedFetch, id, isAuthLoading]);

  async function handleSubmit(payload: TeamMemberWrite) {
    await updateTeamMember(authedFetch, id, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Editar miembro
      </h1>

      {status === "loading" && <SkeletonForm fields={7} />}
      {status === "error" && (
        <ErrorState message="No fue posible cargar el miembro del equipo." />
      )}
      {status === "ready" && member && (
        <div className="mt-6 max-w-2xl">
          <TeamMemberForm
            initialValue={member}
            onSubmit={handleSubmit}
            submitLabel="Guardar cambios"
          />
        </div>
      )}
    </div>
  );
}
