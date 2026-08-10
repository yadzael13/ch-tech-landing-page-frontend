import { getTechnologies } from "@/lib/api/content";
import TechStackReveal from "./TechStackReveal";

export default async function TechStack() {
  let technologies: Awaited<ReturnType<typeof getTechnologies>> = [];
  let hasError = false;

  try {
    technologies = await getTechnologies();
  } catch {
    hasError = true;
  }

  return <TechStackReveal technologies={technologies} hasError={hasError} />;
}
