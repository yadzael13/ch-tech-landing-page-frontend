import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import AdminTeamPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <AdminTeamPage />
    </AuthProvider>,
  );
}

const sampleMember = {
  id: "1",
  user_id: null,
  name: "Yadzael Chalico",
  role: "Founder & Lead Software Engineer",
  bio: null,
  photo: null,
  linkedin_url: null,
  github_url: null,
  display_order: 0,
  active: true,
};

beforeEach(() => {
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
    ),
  );
});

describe("AdminTeamPage", () => {
  it("renders the list of team members", async () => {
    server.use(
      http.get(`${API_URL}/admin/team`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleMember],
          message: null,
        }),
      ),
    );

    renderPage();

    expect(await screen.findByText("Yadzael Chalico")).toBeInTheDocument();
  });

  it("shows an empty state when there are no members", async () => {
    server.use(
      http.get(`${API_URL}/admin/team`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    renderPage();

    expect(await screen.findByText("Aún no hay miembros.")).toBeInTheDocument();
  });

  it("deletes a member after confirming", async () => {
    server.use(
      http.get(`${API_URL}/admin/team`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleMember],
          message: null,
        }),
      ),
      http.delete(
        `${API_URL}/admin/team/1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderPage();
    await screen.findByText("Yadzael Chalico");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() =>
      expect(screen.queryByText("Yadzael Chalico")).not.toBeInTheDocument(),
    );
  });
});
