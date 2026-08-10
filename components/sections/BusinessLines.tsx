import { getServiceLines } from "@/lib/api/content";
import BusinessLinesReveal from "./BusinessLinesReveal";

export default async function BusinessLines() {
  let serviceLines: Awaited<ReturnType<typeof getServiceLines>> = [];
  let hasError = false;

  try {
    serviceLines = await getServiceLines();
  } catch {
    hasError = true;
  }

  return (
    <BusinessLinesReveal serviceLines={serviceLines} hasError={hasError} />
  );
}
