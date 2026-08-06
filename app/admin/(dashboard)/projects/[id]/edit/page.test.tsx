import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import EditProjectPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: "p1" }),
}));

const existingProject = {
  id: "p1",
  slug: "existing",
  title: "Existing Project",
  short_description: null,
  full_description: null,
  repository_url: null,
  live_demo_url: null,
  cover_image: null,
  status: "PLANNING",
  visibility: "PRIVATE",
  featured: false,
  started_at: null,
  finished_at: null,
  technologies: [],
};

describe("EditProjectPage", () => {
  it("loads and prefills the project being edited", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/admin/projects/p1`, () =>
        HttpResponse.json({
          success: true,
          data: existingProject,
          message: null,
        }),
      ),
      http.get(`${API_URL}/technologies`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(
      <AuthProvider>
        <EditProjectPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByDisplayValue("Existing Project"),
    ).toBeInTheDocument();
  });

  it("shows an error state when loading the project fails", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/admin/projects/p1`, () =>
        HttpResponse.json(
          {
            error: { code: "RESOURCE_NOT_FOUND", message: "Project not found" },
          },
          { status: 404 },
        ),
      ),
    );

    render(
      <AuthProvider>
        <EditProjectPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("No fue posible cargar el proyecto."),
    ).toBeInTheDocument();
  });
});
