import { getFeaturedProjects } from "@/lib/api/content";
import ProjectsReveal from "./ProjectsReveal";

export default async function Projects() {
  let projects: Awaited<ReturnType<typeof getFeaturedProjects>> = [];
  let hasError = false;

  try {
    projects = await getFeaturedProjects();
  } catch {
    hasError = true;
  }

  return <ProjectsReveal projects={projects} hasError={hasError} />;
}
