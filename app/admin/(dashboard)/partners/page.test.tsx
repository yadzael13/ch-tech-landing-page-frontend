import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import AdminPartnersPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <AdminPartnersPage />
    </AuthProvider>,
  );
}

const samplePartner = {
  id: "1",
  name: "AWS",
  logo: null,
  partnership_type: "Cloud",
  website_url: null,
};

beforeEach(() => {
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
    ),
  );
});

describe("AdminPartnersPage", () => {
  it("renders the list of partners", async () => {
    server.use(
      http.get(`${API_URL}/partners`, () =>
        HttpResponse.json({
          success: true,
          data: [samplePartner],
          message: null,
        }),
      ),
    );

    renderPage();

    expect(await screen.findByText("AWS")).toBeInTheDocument();
  });

  it("shows an empty state when there are no partners", async () => {
    server.use(
      http.get(`${API_URL}/partners`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    renderPage();

    expect(
      await screen.findByText("Aún no hay partners."),
    ).toBeInTheDocument();
  });

  it("deletes a partner after confirming", async () => {
    server.use(
      http.get(`${API_URL}/partners`, () =>
        HttpResponse.json({
          success: true,
          data: [samplePartner],
          message: null,
        }),
      ),
      http.delete(
        `${API_URL}/admin/partners/1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderPage();
    await screen.findByText("AWS");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() =>
      expect(screen.queryByText("AWS")).not.toBeInTheDocument(),
    );
  });
});
