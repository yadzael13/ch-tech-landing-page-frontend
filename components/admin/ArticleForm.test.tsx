import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { ArticleDetail } from "@/lib/api/types";
import ArticleForm from "./ArticleForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

function mockTechnologies() {
  server.use(
    http.get(`${API_URL}/technologies`, () =>
      HttpResponse.json({ success: true, data: [], message: null }),
    ),
  );
}

const existingArticle: ArticleDetail = {
  id: "a1",
  slug: "deep-dive",
  title: "Deep Dive",
  summary: "A summary",
  content: "Full body content",
  cover_image: null,
  reading_time: 5,
  published: true,
  published_at: "2026-01-01T10:00:00Z",
  author_id: "u1",
  technologies: [],
};

describe("ArticleForm", () => {
  it("submits the expected payload shape and redirects on success", async () => {
    mockTechnologies();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ArticleForm onSubmit={onSubmit} submitLabel="Crear artículo" />);

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "New Post" },
    });
    fireEvent.change(screen.getByLabelText("Slug"), {
      target: { value: "new-post" },
    });
    fireEvent.change(screen.getByLabelText("Contenido"), {
      target: { value: "Body text" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear artículo" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "New Post",
        slug: "new-post",
        content: "Body text",
        published: false,
      }),
    );
    expect(pushMock).toHaveBeenCalledWith("/admin/articles");
  });

  it("prefills fields from initialValue when editing", () => {
    mockTechnologies();

    render(
      <ArticleForm
        initialValue={existingArticle}
        onSubmit={vi.fn()}
        submitLabel="Guardar cambios"
      />,
    );

    expect(screen.getByLabelText("Título")).toHaveValue("Deep Dive");
    expect(screen.getByLabelText("Contenido")).toHaveValue("Full body content");
    expect(screen.getByLabelText("Publicado")).toBeChecked();
  });

  it("shows an error message when onSubmit rejects", async () => {
    mockTechnologies();
    const onSubmit = vi
      .fn()
      .mockRejectedValue(
        new Error("published_at is required when published is true"),
      );

    render(<ArticleForm onSubmit={onSubmit} submitLabel="Crear artículo" />);
    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Bad" },
    });
    fireEvent.change(screen.getByLabelText("Slug"), {
      target: { value: "bad" },
    });
    fireEvent.change(screen.getByLabelText("Contenido"), {
      target: { value: "Body" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear artículo" }));

    expect(
      await screen.findByText(
        "published_at is required when published is true",
      ),
    ).toBeInTheDocument();
  });
});
