// Server Components run inside the frontend container, where "localhost"
// resolves to that container, not the backend one — API_URL (Compose service
// name, docker-compose.yml/.env.example) is for that case. The browser has
// no such container boundary, so it always uses the public host/port
// (NEXT_PUBLIC_API_URL).
const API_URL =
  typeof window === "undefined"
    ? (process.env.API_URL ??
      process.env.NEXT_PUBLIC_API_URL ??
      "http://localhost:8000/api/v1")
    : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1");

/** The envelope every success response follows (docs/API.md), except
 * POST /contact which returns its own shape unenveloped by design. */
export interface SuccessEnvelope<T> {
  success: true;
  data: T;
  message: string | null;
}

interface ErrorEnvelope {
  success: false;
  error: { code: string; message: string };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    // Without this, Next's extended fetch caches GET requests indefinitely
    // and statically freezes any page that calls apiFetch at build time —
    // admin edits (Company, Team, Testimonials, Clients, Products,
    // ServiceLines) would never reach the public site without a redeploy
    // (TASK-053). No-op for non-GET requests (e.g. POST /contact) and for
    // client-side calls (authedFetch/admin), which Next doesn't cache.
    next: { revalidate: 60 },
  });

  // 204 No Content (DELETE endpoints) has no body — response.json() would
  // throw on the empty string.
  if (response.status === 204) {
    return undefined as T;
  }

  const body: unknown = await response.json();

  if (!response.ok) {
    const errorBody = body as ErrorEnvelope;
    throw new ApiError(
      errorBody.error.message,
      errorBody.error.code,
      response.status,
    );
  }

  return body as T;
}
