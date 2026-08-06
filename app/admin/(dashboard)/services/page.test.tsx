import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import AdminServicesPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <AdminServicesPage />
    </AuthProvider>,
  );
}

const sampleService = {
  id: "1",
  slug: "consulting",
  title: "Consulting",
  description: "Asesoría técnica",
  featured: true,
  active: true,
};

beforeEach(() => {
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
    ),
  );
});

describe("AdminServicesPage", () => {
  it("renders the list of services", async () => {
    server.use(
      http.get(`${API_URL}/admin/services`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleService],
          message: null,
        }),
      ),
    );

    renderPage();

    expect(await screen.findByText("Consulting")).toBeInTheDocument();
  });

  it("shows an empty state when there are no services", async () => {
    server.use(
      http.get(`${API_URL}/admin/services`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    renderPage();

    expect(
      await screen.findByText("Aún no hay servicios."),
    ).toBeInTheDocument();
  });

  it("deletes a service after confirming", async () => {
    server.use(
      http.get(`${API_URL}/admin/services`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleService],
          message: null,
        }),
      ),
      http.delete(
        `${API_URL}/admin/services/1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderPage();
    await screen.findByText("Consulting");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() =>
      expect(screen.queryByText("Consulting")).not.toBeInTheDocument(),
    );
  });
});
