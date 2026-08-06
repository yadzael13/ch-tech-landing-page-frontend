import { setupServer } from "msw/node";

export const server = setupServer();

/** Matches lib/api/client.ts's fallback base URL — tests never set
 * NEXT_PUBLIC_API_URL, so every handler is registered against this. */
export const API_URL = "http://localhost:8000/api/v1";
