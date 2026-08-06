import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import AdminTestimonialsPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <AdminTestimonialsPage />
    </AuthProvider>,
  );
}

const sampleTestimonial = {
  id: "1",
  author_name: "Jane Doe",
  author_role: "CTO",
  client_id: null,
  project_id: null,
  content: "Great work.",
  rating: 5,
  featured: true,
};

beforeEach(() => {
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
    ),
  );
});

describe("AdminTestimonialsPage", () => {
  it("renders the list of testimonials", async () => {
    server.use(
      http.get(`${API_URL}/testimonials`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleTestimonial],
          message: null,
        }),
      ),
    );

    renderPage();

    expect(await screen.findByText("Jane Doe")).toBeInTheDocument();
  });

  it("shows an empty state when there are no testimonials", async () => {
    server.use(
      http.get(`${API_URL}/testimonials`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    renderPage();

    expect(
      await screen.findByText("Aún no hay testimonios."),
    ).toBeInTheDocument();
  });

  it("deletes a testimonial after confirming", async () => {
    server.use(
      http.get(`${API_URL}/testimonials`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleTestimonial],
          message: null,
        }),
      ),
      http.delete(
        `${API_URL}/admin/testimonials/1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderPage();
    await screen.findByText("Jane Doe");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    await waitFor(() =>
      expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument(),
    );
  });
});
