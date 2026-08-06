import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import AdminProjectsPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <AdminProjectsPage />
    </AuthProvider>,
  );
}

const sampleProject = {
  id: "1",
  slug: "ch-tech",
  title: "CH-TECH",
  short_description: null,
  full_description: null,
  repository_url: null,
  live_demo_url: null,
  cover_image: null,
  status: "COMPLETED",
  visibility: "PUBLIC",
  featured: true,
  started_at: null,
  finished_at: null,
  technologies: [],
};

beforeEach(() => {
  // AuthProvider's mount-time silent refresh — authenticated by default so
  // each test starts already able to call authedFetch.
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
    ),
  );
});

describe("AdminProjectsPage", () => {
  it("renders the list of projects", async () => {
    server.use(
      http.get(`${API_URL}/admin/projects`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleProject],
          message: null,
        }),
      ),
    );

    renderPage();

    expect(await screen.findByText("CH-TECH")).toBeInTheDocument();
    expect(screen.getByText("COMPLETED")).toBeInTheDocument();
  });

  it("shows an empty state when there are no projects", async () => {
    server.use(
      http.get(`${API_URL}/admin/projects`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    renderPage();

    expect(
      await screen.findByText("Aún no hay proyectos."),
    ).toBeInTheDocument();
  });

  it("deletes a project after confirming", async () => {
    server.use(
      http.get(`${API_URL}/admin/projects`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleProject],
          message: null,
        }),
      ),
      http.delete(
        `${API_URL}/admin/projects/1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderPage();
    await screen.findByText("CH-TECH");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() =>
      expect(screen.queryByText("CH-TECH")).not.toBeInTheDocument(),
    );
  });
});
