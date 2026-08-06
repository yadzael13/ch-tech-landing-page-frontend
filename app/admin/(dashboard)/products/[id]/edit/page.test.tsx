import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import EditProductPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: "pr1" }),
}));

const existingProduct = {
  id: "pr1",
  slug: "ch-tech-cloud",
  name: "CH-TECH Cloud",
  short_description: null,
  full_description: null,
  status: "BETA",
  url: null,
  logo: null,
  featured: true,
};

describe("EditProductPage", () => {
  it("loads and prefills the product being edited", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/products`, () =>
        HttpResponse.json({
          success: true,
          data: [existingProduct],
          message: null,
        }),
      ),
    );

    render(
      <AuthProvider>
        <EditProductPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByDisplayValue("CH-TECH Cloud"),
    ).toBeInTheDocument();
  });

  it("shows an error state when the product is not found in the list", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/products`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(
      <AuthProvider>
        <EditProductPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("No fue posible cargar el producto."),
    ).toBeInTheDocument();
  });
});
