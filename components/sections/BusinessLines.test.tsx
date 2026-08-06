import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import BusinessLines from "./BusinessLines";

const softwareEngineering = {
  id: "1",
  slug: "software-engineering",
  name: "Software Engineering",
  description: "Arquitectura y desarrollo de productos digitales a medida.",
  icon: null,
  display_order: 0,
};

const aiAutomation = {
  ...softwareEngineering,
  id: "2",
  slug: "ai-automation",
  name: "AI & Automation",
  display_order: 1,
};

describe("BusinessLines", () => {
  it("renders every business line returned by the API", async () => {
    server.use(
      http.get(`${API_URL}/service-lines`, () =>
        HttpResponse.json({
          success: true,
          data: [softwareEngineering, aiAutomation],
          message: null,
        }),
      ),
    );

    render(await BusinessLines());

    expect(
      screen.getByText(softwareEngineering.name),
    ).toBeInTheDocument();
    expect(screen.getByText(aiAutomation.name)).toBeInTheDocument();
  });

  it("shows an empty state when there are no business lines", async () => {
    server.use(
      http.get(`${API_URL}/service-lines`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(await BusinessLines());

    expect(
      screen.getByText("Aún no hay líneas de negocio publicadas."),
    ).toBeInTheDocument();
  });

  it("shows an error state when the API request fails", async () => {
    server.use(
      http.get(`${API_URL}/service-lines`, () =>
        HttpResponse.json(
          {
            success: false,
            error: { code: "INTERNAL_SERVER_ERROR", message: "boom" },
          },
          { status: 500 },
        ),
      ),
    );

    render(await BusinessLines());

    expect(
      screen.getByText(
        "No fue posible cargar las líneas de negocio en este momento.",
      ),
    ).toBeInTheDocument();
  });
});
