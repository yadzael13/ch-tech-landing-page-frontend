import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import Team from "./Team";

const founder = {
  id: "1",
  user_id: null,
  name: "Yadzael Chalico",
  role: "Founder & Lead Software Engineer",
  bio: "Fundador de CH-TECH.",
  photo: null,
  linkedin_url: "https://linkedin.com/in/yadzael",
  github_url: "https://github.com/yadzael",
  display_order: 0,
  active: true,
};

describe("Team", () => {
  it("renders every team member returned by the API", async () => {
    server.use(
      http.get(`${API_URL}/team`, () =>
        HttpResponse.json({ success: true, data: [founder], message: null }),
      ),
    );

    render(await Team());

    expect(screen.getByText(founder.name)).toBeInTheDocument();
    expect(screen.getByText(founder.role)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
      "href",
      founder.linkedin_url,
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      founder.github_url,
    );
  });

  it("shows an empty state when there are no team members", async () => {
    server.use(
      http.get(`${API_URL}/team`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(await Team());

    expect(
      screen.getByText("Aún no hay miembros del equipo publicados."),
    ).toBeInTheDocument();
  });

  it("shows an error state when the API request fails", async () => {
    server.use(
      http.get(`${API_URL}/team`, () =>
        HttpResponse.json(
          {
            success: false,
            error: { code: "INTERNAL_SERVER_ERROR", message: "boom" },
          },
          { status: 500 },
        ),
      ),
    );

    render(await Team());

    expect(
      screen.getByText("No fue posible cargar el equipo en este momento."),
    ).toBeInTheDocument();
  });
});
