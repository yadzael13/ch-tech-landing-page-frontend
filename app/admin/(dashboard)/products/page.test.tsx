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
import AdminProductsPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <AdminProductsPage />
    </AuthProvider>,
  );
}

const sampleProduct = {
  id: "1",
  slug: "ch-tech-cloud",
  name: "CH-TECH Cloud",
  short_description: null,
  full_description: null,
  status: "BETA",
  url: null,
  logo: null,
  featured: true,
};

beforeEach(() => {
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
    ),
  );
});

describe("AdminProductsPage", () => {
  it("renders the list of products", async () => {
    server.use(
      http.get(`${API_URL}/products`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleProduct],
          message: null,
        }),
      ),
    );

    renderPage();

    expect(await screen.findByText("CH-TECH Cloud")).toBeInTheDocument();
  });

  it("shows an empty state when there are no products", async () => {
    server.use(
      http.get(`${API_URL}/products`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    renderPage();

    expect(
      await screen.findByText("Aún no hay productos."),
    ).toBeInTheDocument();
  });

  it("deletes a product after confirming in the dialog", async () => {
    server.use(
      http.get(`${API_URL}/products`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleProduct],
          message: null,
        }),
      ),
      http.delete(
        `${API_URL}/admin/products/1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    renderPage();
    await screen.findByText("CH-TECH Cloud");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Eliminar" }));

    await waitFor(() =>
      expect(screen.queryByText("CH-TECH Cloud")).not.toBeInTheDocument(),
    );
  });

  it("keeps the product when the delete dialog is cancelled", async () => {
    server.use(
      http.get(`${API_URL}/products`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleProduct],
          message: null,
        }),
      ),
    );

    renderPage();
    await screen.findByText("CH-TECH Cloud");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("CH-TECH Cloud")).toBeInTheDocument();
  });
});
