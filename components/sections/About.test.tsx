import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { about } from "@/lib/content/site";
import About from "./About";

const sampleCompany = {
  id: "1",
  legal_name: "CH-TECH S.A. de C.V.",
  display_name: "CH-TECH",
  tagline: null,
  mission: null,
  vision: "Ser referencia en ingeniería de software e IA en 5 años.",
  email: null,
  phone: null,
  address: null,
  social_links: null,
};

describe("About", () => {
  it("renders the Company vision and every differentiator point", async () => {
    server.use(
      http.get(`${API_URL}/company`, () =>
        HttpResponse.json({
          success: true,
          data: sampleCompany,
          message: null,
        }),
      ),
    );

    render(await About());

    expect(
      screen.getByRole("heading", { name: about.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(sampleCompany.vision)).toBeInTheDocument();
    for (const point of about.points) {
      expect(screen.getByText(point.title)).toBeInTheDocument();
    }
  });

  it("falls back to static copy when the API request fails", async () => {
    server.use(
      http.get(`${API_URL}/company`, () =>
        HttpResponse.json(
          {
            success: false,
            error: { code: "INTERNAL_SERVER_ERROR", message: "boom" },
          },
          { status: 500 },
        ),
      ),
    );

    render(await About());

    expect(screen.getByText(about.fallbackIntro)).toBeInTheDocument();
  });
});
