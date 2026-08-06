import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import NewTechnologyPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("NewTechnologyPage", () => {
  it("renders the create form", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
    );

    render(
      <AuthProvider>
        <NewTechnologyPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByRole("button", { name: "Crear tecnología" }),
    ).toBeInTheDocument();
  });
});
