"use client";

import TeamMemberForm from "@/components/admin/TeamMemberForm";
import { createTeamMember } from "@/lib/api/admin";
import { useAuth } from "@/lib/auth/AuthContext";
import { TeamMemberWrite } from "@/lib/api/types";

export default function NewTeamMemberPage() {
  const { authedFetch } = useAuth();

  async function handleSubmit(payload: TeamMemberWrite) {
    await createTeamMember(authedFetch, payload);
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Nuevo miembro
      </h1>
      <div className="mt-6 max-w-2xl">
        <TeamMemberForm onSubmit={handleSubmit} submitLabel="Crear miembro" />
      </div>
    </div>
  );
}
