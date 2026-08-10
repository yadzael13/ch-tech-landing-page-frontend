import { getClients } from "@/lib/api/content";
import ClientsReveal from "./ClientsReveal";

export default async function Clients() {
  let clients: Awaited<ReturnType<typeof getClients>> = [];
  let hasError = false;

  try {
    clients = await getClients();
  } catch {
    hasError = true;
  }

  return <ClientsReveal clients={clients} hasError={hasError} />;
}
