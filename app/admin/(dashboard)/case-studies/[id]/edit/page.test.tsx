import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import EditCaseStudyPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: "cs1" }),
}));

const existingCaseStudy = {
  id: "cs1",
  project_id: "p1",
  challenge: "Scale to 10x traffic",
  solution: null,
  architecture: null,
  lessons_learned: null,
  metrics: null,
};

describe("EditCaseStudyPage", () => {
  it("loads and prefills the case study being edited", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/admin/case-studies/cs1`, () =>
        HttpResponse.json({
          success: true,
          data: existingCaseStudy,
          message: null,
        }),
      ),
      http.get(`${API_URL}/admin/projects`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(
      <AuthProvider>
        <EditCaseStudyPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByDisplayValue("Scale to 10x traffic"),
    ).toBeInTheDocument();
  });

  it("shows an error state when loading the case study fails", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/admin/case-studies/cs1`, () =>
        HttpResponse.json(
          {
            error: {
              code: "RESOURCE_NOT_FOUND",
              message: "Case study not found",
            },
          },
          { status: 404 },
        ),
      ),
    );

    render(
      <AuthProvider>
        <EditCaseStudyPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("No fue posible cargar el caso de estudio."),
    ).toBeInTheDocument();
  });
});
