import { getTeamMembers } from "@/lib/api/content";
import TeamReveal from "./TeamReveal";

export default async function Team() {
  let members: Awaited<ReturnType<typeof getTeamMembers>> = [];
  let hasError = false;

  try {
    members = await getTeamMembers();
  } catch {
    hasError = true;
  }

  return <TeamReveal members={members} hasError={hasError} />;
}
