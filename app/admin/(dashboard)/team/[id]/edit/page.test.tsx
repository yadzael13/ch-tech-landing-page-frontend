import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import EditTeamMemberPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: "m1" }),
}));

const existingMember = {
  id: "m1",
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

describe("EditTeamMemberPage", () => {
  it("loads and prefills the member being edited", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/admin/team/m1`, () =>
        HttpResponse.json({
          success: true,
          data: existingMember,
          message: null,
        }),
      ),
    );

    render(
      <AuthProvider>
        <EditTeamMemberPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByDisplayValue("Yadzael Chalico"),
    ).toBeInTheDocument();
  });

  it("shows an error state when loading the member fails", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/admin/team/m1`, () =>
        HttpResponse.json(
          {
            error: {
              code: "RESOURCE_NOT_FOUND",
              message: "Team member not found",
            },
          },
          { status: 404 },
        ),
      ),
    );

    render(
      <AuthProvider>
        <EditTeamMemberPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("No fue posible cargar el miembro del equipo."),
    ).toBeInTheDocument();
  });
});
