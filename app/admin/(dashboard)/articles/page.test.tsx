import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import AdminArticlesPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <AdminArticlesPage />
    </AuthProvider>,
  );
}

const sampleArticle = {
  id: "1",
  slug: "deep-dive",
  title: "Deep Dive",
  summary: null,
  content: "content",
  cover_image: null,
  reading_time: null,
  published: true,
  published_at: "2026-01-01T10:00:00Z",
  author_id: "u1",
  technologies: [],
};

beforeEach(() => {
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
    ),
  );
});

describe("AdminArticlesPage", () => {
  it("renders the list of articles", async () => {
    server.use(
      http.get(`${API_URL}/admin/articles`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleArticle],
          message: null,
        }),
      ),
    );

    renderPage();

    expect(await screen.findByText("Deep Dive")).toBeInTheDocument();
  });

  it("shows an empty state when there are no articles", async () => {
    server.use(
      http.get(`${API_URL}/admin/articles`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    renderPage();

    expect(
      await screen.findByText("Aún no hay artículos."),
    ).toBeInTheDocument();
  });

  it("deletes an article after confirming in the dialog", async () => {
    server.use(
      http.get(`${API_URL}/admin/articles`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleArticle],
          message: null,
        }),
      ),
      http.delete(
        `${API_URL}/admin/articles/1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    renderPage();
    await screen.findByText("Deep Dive");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Eliminar" }));

    await waitFor(() =>
      expect(screen.queryByText("Deep Dive")).not.toBeInTheDocument(),
    );
  });

  it("keeps the article when the delete dialog is cancelled", async () => {
    server.use(
      http.get(`${API_URL}/admin/articles`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleArticle],
          message: null,
        }),
      ),
    );

    renderPage();
    await screen.findByText("Deep Dive");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Deep Dive")).toBeInTheDocument();
  });
});
