import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import AdminShell from "./AdminShell";

const replaceMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

function renderShell() {
  return render(
    <AuthProvider>
      <AdminShell>
        <p>Protected content</p>
      </AdminShell>
    </AuthProvider>,
  );
}

describe("AdminShell", () => {
  it("renders the chrome and children when authenticated", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
    );

    renderShell();

    expect(await screen.findByText("Protected content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salir" })).toBeInTheDocument();
  });

  it("redirects to /admin/login when there is no session", async () => {
    replaceMock.mockClear();
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json(
          { error: { code: "UNAUTHORIZED", message: "No active session" } },
          { status: 401 },
        ),
      ),
    );

    renderShell();

    await waitFor(() =>
      expect(replaceMock).toHaveBeenCalledWith("/admin/login"),
    );
    expect(screen.queryByText("Protected content")).not.toBeInTheDocument();
  });
});
