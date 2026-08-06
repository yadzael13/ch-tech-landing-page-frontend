import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import EditServicePage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: "s1" }),
}));

const existingService = {
  id: "s1",
  slug: "consulting",
  title: "Consulting",
  description: "Asesoría técnica",
  featured: false,
  active: true,
};

describe("EditServicePage", () => {
  it("loads and prefills the service being edited", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/admin/services/s1`, () =>
        HttpResponse.json({
          success: true,
          data: existingService,
          message: null,
        }),
      ),
    );

    render(
      <AuthProvider>
        <EditServicePage />
      </AuthProvider>,
    );

    expect(await screen.findByDisplayValue("Consulting")).toBeInTheDocument();
  });

  it("shows an error state when loading the service fails", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/admin/services/s1`, () =>
        HttpResponse.json(
          {
            error: { code: "RESOURCE_NOT_FOUND", message: "Service not found" },
          },
          { status: 404 },
        ),
      ),
    );

    render(
      <AuthProvider>
        <EditServicePage />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("No fue posible cargar el servicio."),
    ).toBeInTheDocument();
  });
});
