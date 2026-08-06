import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider, useAuth } from "./AuthContext";

function renderAuth() {
  return renderHook(() => useAuth(), {
    wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
  });
}

describe("AuthProvider", () => {
  it("stays unauthenticated when the silent refresh finds no session", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json(
          { error: { code: "UNAUTHORIZED", message: "No active session" } },
          { status: 401 },
        ),
      ),
    );

    const { result } = renderAuth();

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isAuthenticated).toBe(false);
  });

  it("becomes authenticated after a successful silent refresh", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "silent-token" }),
      ),
    );

    const { result } = renderAuth();

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
  });

  it("login() authenticates on success", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json(
          { error: { code: "UNAUTHORIZED", message: "No active session" } },
          { status: 401 },
        ),
      ),
    );

    const { result } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    server.use(
      http.post("/api/auth/login", () =>
        HttpResponse.json({ access_token: "login-token" }),
      ),
    );

    await result.current.login("admin@ch-tech.dev", "s3cret");

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
  });

  it("login() rejects on invalid credentials", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json(
          { error: { code: "UNAUTHORIZED", message: "No active session" } },
          { status: 401 },
        ),
      ),
    );

    const { result } = renderAuth();
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    server.use(
      http.post("/api/auth/login", () =>
        HttpResponse.json(
          {
            error: {
              code: "UNAUTHORIZED",
              message: "Invalid email or password",
            },
          },
          { status: 401 },
        ),
      ),
    );

    await expect(
      result.current.login("admin@ch-tech.dev", "wrong"),
    ).rejects.toMatchObject({
      status: 401,
    });
  });

  it("authedFetch refreshes once and retries after a 401 from the API", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "stale-token" }),
      ),
    );
    const { result } = renderAuth();
    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));

    server.use(
      http.get(
        `${API_URL}/admin/projects`,
        () =>
          HttpResponse.json(
            {
              error: {
                code: "UNAUTHORIZED",
                message: "Invalid or expired access token",
              },
            },
            { status: 401 },
          ),
        { once: true },
      ),
      http.post(
        "/api/auth/refresh",
        () => HttpResponse.json({ access_token: "fresh-token" }),
        { once: true },
      ),
      http.get(`${API_URL}/admin/projects`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    const data = await result.current.authedFetch("/admin/projects");
    expect(data).toEqual({ success: true, data: [], message: null });
  });
});
