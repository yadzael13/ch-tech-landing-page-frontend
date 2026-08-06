import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import Products from "./Products";

const betaProduct = {
  id: "1",
  slug: "ch-tech-cloud",
  name: "CH-TECH Cloud",
  short_description: "Automatización de flujos de trabajo con IA.",
  full_description: null,
  status: "BETA",
  url: null,
  logo: null,
  featured: true,
};

describe("Products", () => {
  it("renders every product with a translated status label", async () => {
    server.use(
      http.get(`${API_URL}/products`, () =>
        HttpResponse.json({
          success: true,
          data: [betaProduct],
          message: null,
        }),
      ),
    );

    render(await Products());

    expect(screen.getByText(betaProduct.name)).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("shows a waitlist placeholder when there are no products yet", async () => {
    server.use(
      http.get(`${API_URL}/products`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(await Products());

    expect(
      screen.getByText(
        "Estamos construyendo nuestra primera línea de productos SaaS.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Únete a la lista de espera" }),
    ).toHaveAttribute("href", "#contacto");
  });

  it("shows an error state when the API request fails", async () => {
    server.use(
      http.get(`${API_URL}/products`, () =>
        HttpResponse.json(
          {
            success: false,
            error: { code: "INTERNAL_SERVER_ERROR", message: "boom" },
          },
          { status: 500 },
        ),
      ),
    );

    render(await Products());

    expect(
      screen.getByText("No fue posible cargar los productos en este momento."),
    ).toBeInTheDocument();
  });
});
