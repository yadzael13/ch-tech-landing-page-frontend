import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import EditPartnerPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: "p1" }),
}));

const existingPartner = {
  id: "p1",
  name: "AWS",
  logo: null,
  partnership_type: "Cloud",
  website_url: null,
};

describe("EditPartnerPage", () => {
  it("loads and prefills the partner being edited", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/partners`, () =>
        HttpResponse.json({
          success: true,
          data: [existingPartner],
          message: null,
        }),
      ),
    );

    render(
      <AuthProvider>
        <EditPartnerPage />
      </AuthProvider>,
    );

    expect(await screen.findByDisplayValue("AWS")).toBeInTheDocument();
  });

  it("shows an error state when the partner is not found in the list", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/partners`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(
      <AuthProvider>
        <EditPartnerPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("No fue posible cargar el partner."),
    ).toBeInTheDocument();
  });
});
