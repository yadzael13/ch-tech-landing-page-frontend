import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import TechStack from "./TechStack";

describe("TechStack", () => {
  it("renders every technology returned by the API", async () => {
    server.use(
      http.get(`${API_URL}/technologies`, () =>
        HttpResponse.json({
          success: true,
          data: [
            {
              id: "1",
              name: "Python",
              category: "backend",
              icon: null,
              official_url: null,
            },
            {
              id: "2",
              name: "Next.js",
              category: "frontend",
              icon: null,
              official_url: null,
            },
          ],
          message: null,
        }),
      ),
    );

    render(await TechStack());

    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.getByText("Next.js")).toBeInTheDocument();
  });

  it("shows an empty state when there are no technologies", async () => {
    server.use(
      http.get(`${API_URL}/technologies`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(await TechStack());

    expect(
      screen.getByText("Aún no hay tecnologías publicadas."),
    ).toBeInTheDocument();
  });

  it("shows an error state when the API request fails", async () => {
    server.use(
      http.get(`${API_URL}/technologies`, () =>
        HttpResponse.json(
          {
            success: false,
            error: { code: "INTERNAL_SERVER_ERROR", message: "boom" },
          },
          { status: 500 },
        ),
      ),
    );

    render(await TechStack());

    expect(
      screen.getByText(
        "No fue posible cargar las tecnologías en este momento.",
      ),
    ).toBeInTheDocument();
  });
});
