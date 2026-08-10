import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
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

  it("deletes a service after confirming in the dialog", async () => {
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

    renderPage();
    await screen.findByText("Consulting");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Eliminar" }));

    await waitFor(() =>
      expect(screen.queryByText("Consulting")).not.toBeInTheDocument(),
    );
  });

  it("keeps the service when the delete dialog is cancelled", async () => {
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
    await screen.findByText("Consulting");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Consulting")).toBeInTheDocument();
  });
});
