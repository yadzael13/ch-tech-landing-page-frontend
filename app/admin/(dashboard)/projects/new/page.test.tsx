import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import NewProjectPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("NewProjectPage", () => {
  it("renders the create form", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/technologies`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(
      <AuthProvider>
        <NewProjectPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByRole("button", { name: "Crear proyecto" }),
    ).toBeInTheDocument();
  });
});
