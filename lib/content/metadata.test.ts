import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, buildMetadata } from "./metadata";

const sampleCompany = {
  id: "1",
  legal_name: "CH-TECH S.A. de C.V.",
  display_name: "CH-TECH",
  tagline: "Construimos productos digitales escalables para empresas.",
  mission: null,
  vision: null,
  email: null,
  phone: null,
  address: null,
  social_links: null,
};

describe("buildMetadata", () => {
  it("builds title/description/openGraph from the Company profile", async () => {
    server.use(
      http.get(`${API_URL}/company`, () =>
        HttpResponse.json({
          success: true,
          data: sampleCompany,
          message: null,
        }),
      ),
    );

    const metadata = await buildMetadata();

    expect(metadata.title).toContain(sampleCompany.display_name);
    expect(metadata.description).toBe(sampleCompany.tagline);
    expect(metadata.openGraph?.title).toContain(sampleCompany.display_name);
    expect(metadata.openGraph?.description).toBe(sampleCompany.tagline);
    expect(metadata.openGraph?.siteName).toBe("CH-TECH");
  });

  it("falls back to static metadata when the API request fails", async () => {
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

    const metadata = await buildMetadata();

    expect(metadata.title).toBe(DEFAULT_TITLE);
    expect(metadata.description).toBe(DEFAULT_DESCRIPTION);
  });

  it("falls back to the default description when Company has no tagline", async () => {
    server.use(
      http.get(`${API_URL}/company`, () =>
        HttpResponse.json({
          success: true,
          data: { ...sampleCompany, tagline: null },
          message: null,
        }),
      ),
    );

    const metadata = await buildMetadata();

    expect(metadata.description).toBe(DEFAULT_DESCRIPTION);
  });
});
