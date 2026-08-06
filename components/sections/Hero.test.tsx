import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { hero } from "@/lib/content/site";
import Hero from "./Hero";

const sampleCompany = {
  id: "1",
  legal_name: "CH-TECH S.A. de C.V.",
  display_name: "CH-TECH",
  tagline: "Construimos productos digitales escalables para empresas.",
  mission: "Automatizar procesos con software e IA.",
  vision: null,
  email: null,
  phone: null,
  address: null,
  social_links: null,
};

describe("Hero", () => {
  it("renders the Company tagline and mission when the API succeeds", async () => {
    server.use(
      http.get(`${API_URL}/company`, () =>
        HttpResponse.json({
          success: true,
          data: sampleCompany,
          message: null,
        }),
      ),
    );

    render(await Hero());

    expect(
      screen.getByRole("heading", { name: sampleCompany.tagline }),
    ).toBeInTheDocument();
    expect(screen.getByText(sampleCompany.mission)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: hero.primaryCta.label }),
    ).toHaveAttribute("href", hero.primaryCta.href);
    expect(
      screen.getByRole("link", { name: hero.secondaryCta.label }),
    ).toHaveAttribute("href", hero.secondaryCta.href);
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

    render(await Hero());

    expect(
      screen.getByRole("heading", { name: hero.fallbackHeadline }),
    ).toBeInTheDocument();
    expect(screen.getByText(hero.fallbackSubtext)).toBeInTheDocument();
  });

  it("falls back to static copy when Company has no tagline/mission set", async () => {
    server.use(
      http.get(`${API_URL}/company`, () =>
        HttpResponse.json({
          success: true,
          data: { ...sampleCompany, tagline: null, mission: null },
          message: null,
        }),
      ),
    );

    render(await Hero());

    expect(
      screen.getByRole("heading", { name: hero.fallbackHeadline }),
    ).toBeInTheDocument();
    expect(screen.getByText(hero.fallbackSubtext)).toBeInTheDocument();
  });
});
