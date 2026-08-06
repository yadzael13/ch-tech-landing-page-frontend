import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import EditClientPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: "c1" }),
}));

const existingClient = {
  id: "c1",
  name: "Acme Corp",
  logo: null,
  industry: "Retail",
  website_url: null,
};

describe("EditClientPage", () => {
  it("loads and prefills the client being edited", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/clients`, () =>
        HttpResponse.json({
          success: true,
          data: [existingClient],
          message: null,
        }),
      ),
    );

    render(
      <AuthProvider>
        <EditClientPage />
      </AuthProvider>,
    );

    expect(await screen.findByDisplayValue("Acme Corp")).toBeInTheDocument();
  });

  it("shows an error state when the client is not found in the list", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/clients`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(
      <AuthProvider>
        <EditClientPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("No fue posible cargar el cliente."),
    ).toBeInTheDocument();
  });
});
