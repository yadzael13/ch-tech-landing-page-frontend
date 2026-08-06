import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import EditArticlePage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: "a1" }),
}));

const existingArticle = {
  id: "a1",
  slug: "deep-dive",
  title: "Deep Dive",
  summary: null,
  content: "content",
  cover_image: null,
  reading_time: null,
  published: false,
  published_at: null,
  author_id: "u1",
  technologies: [],
};

describe("EditArticlePage", () => {
  it("loads and prefills the article being edited", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/admin/articles/a1`, () =>
        HttpResponse.json({
          success: true,
          data: existingArticle,
          message: null,
        }),
      ),
      http.get(`${API_URL}/technologies`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    render(
      <AuthProvider>
        <EditArticlePage />
      </AuthProvider>,
    );

    expect(await screen.findByDisplayValue("Deep Dive")).toBeInTheDocument();
  });

  it("shows an error state when loading the article fails", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/admin/articles/a1`, () =>
        HttpResponse.json(
          {
            error: { code: "RESOURCE_NOT_FOUND", message: "Article not found" },
          },
          { status: 404 },
        ),
      ),
    );

    render(
      <AuthProvider>
        <EditArticlePage />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("No fue posible cargar el artículo."),
    ).toBeInTheDocument();
  });
});
