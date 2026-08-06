import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import Clients from "./Clients";

const acme = {
  id: "1",
  name: "Acme Corp",
  logo: null,
  industry: "Retail",
  website_url: null,
};

describe("Clients", () => {
  it("renders every client returned by the API", async () => {
    server.use(
      http.get(`${API_URL}/clients`, () =>
        HttpResponse.json({ success: true, data: [acme], message: null }),
      ),
    );

    render(await Clients());

    expect(screen.getByText(acme.name)).toBeInTheDocument();
  });

  it("shows an empty state when there are no clients", async () => {
    server.use(
      http.get(`${API_URL}/clients`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(await Clients());

    expect(
      screen.getByText("Aún no hay clientes públicos."),
    ).toBeInTheDocument();
  });

  it("shows an error state when the API request fails", async () => {
    server.use(
      http.get(`${API_URL}/clients`, () =>
        HttpResponse.json(
          {
            success: false,
            error: { code: "INTERNAL_SERVER_ERROR", message: "boom" },
          },
          { status: 500 },
        ),
      ),
    );

    render(await Clients());

    expect(
      screen.getByText("No fue posible cargar los clientes en este momento."),
    ).toBeInTheDocument();
  });
});
