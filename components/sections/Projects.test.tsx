import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import Projects from "./Projects";

describe("Projects", () => {
  it("renders every featured project with a badge", async () => {
    server.use(
      http.get(`${API_URL}/projects`, () =>
        HttpResponse.json({
          success: true,
          data: [
            { id: "1", slug: "ch-tech", title: "CH-TECH", featured: true },
          ],
          message: null,
        }),
      ),
    );

    render(await Projects());

    expect(screen.getByText("CH-TECH")).toBeInTheDocument();
    expect(screen.getByText("Destacado")).toBeInTheDocument();
  });

  it("shows an empty state when there are no featured projects", async () => {
    server.use(
      http.get(`${API_URL}/projects`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(await Projects());

    expect(
      screen.getByText("Aún no hay proyectos destacados publicados."),
    ).toBeInTheDocument();
  });

  it("shows an error state when the API request fails", async () => {
    server.use(
      http.get(`${API_URL}/projects`, () =>
        HttpResponse.json(
          {
            success: false,
            error: { code: "INTERNAL_SERVER_ERROR", message: "boom" },
          },
          { status: 500 },
        ),
      ),
    );

    render(await Projects());

    expect(
      screen.getByText("No fue posible cargar los proyectos en este momento."),
    ).toBeInTheDocument();
  });
});
