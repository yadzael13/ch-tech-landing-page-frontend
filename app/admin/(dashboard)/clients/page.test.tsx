import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import AdminClientsPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <AdminClientsPage />
    </AuthProvider>,
  );
}

const sampleClient = {
  id: "1",
  name: "Acme Corp",
  logo: null,
  industry: "Retail",
  website_url: null,
};

beforeEach(() => {
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
    ),
  );
});

describe("AdminClientsPage", () => {
  it("renders the list of clients", async () => {
    server.use(
      http.get(`${API_URL}/clients`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleClient],
          message: null,
        }),
      ),
    );

    renderPage();

    expect(await screen.findByText("Acme Corp")).toBeInTheDocument();
  });

  it("shows an empty state when there are no clients", async () => {
    server.use(
      http.get(`${API_URL}/clients`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    renderPage();

    expect(
      await screen.findByText("Aún no hay clientes."),
    ).toBeInTheDocument();
  });

  it("deletes a client after confirming", async () => {
    server.use(
      http.get(`${API_URL}/clients`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleClient],
          message: null,
        }),
      ),
      http.delete(
        `${API_URL}/admin/clients/1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderPage();
    await screen.findByText("Acme Corp");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() =>
      expect(screen.queryByText("Acme Corp")).not.toBeInTheDocument(),
    );
  });
});
