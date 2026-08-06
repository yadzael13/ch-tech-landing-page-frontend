import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { TestimonialItem } from "@/lib/api/types";
import TestimonialForm from "./TestimonialForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const sampleClient = {
  id: "c1",
  name: "Acme Corp",
  logo: null,
  industry: null,
  website_url: null,
};

const sampleProject = {
  id: "p1",
  slug: "ch-tech",
  title: "CH-TECH",
  short_description: null,
  full_description: null,
  repository_url: null,
  live_demo_url: null,
  cover_image: null,
  status: "COMPLETED",
  visibility: "PRIVATE",
  featured: false,
  started_at: null,
  finished_at: null,
  technologies: [],
};

const existingTestimonial: TestimonialItem = {
  id: "t1",
  author_name: "Jane Doe",
  author_role: "CTO",
  client_id: "c1",
  project_id: "p1",
  content: "Great work.",
  rating: 5,
  featured: true,
};

function renderForm(
  props: Partial<React.ComponentProps<typeof TestimonialForm>> & {
    onSubmit: React.ComponentProps<typeof TestimonialForm>["onSubmit"];
  },
) {
  return render(
    <AuthProvider>
      <TestimonialForm submitLabel="Crear testimonio" {...props} />
    </AuthProvider>,
  );
}

beforeEach(() => {
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
    ),
    http.get(`${API_URL}/clients`, () =>
      HttpResponse.json({
        success: true,
        data: [sampleClient],
        message: null,
      }),
    ),
    http.get(`${API_URL}/admin/projects`, () =>
      HttpResponse.json({
        success: true,
        data: [sampleProject],
        message: null,
      }),
    ),
  );
});

describe("TestimonialForm", () => {
  it("submits the expected payload shape and redirects on success", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderForm({ onSubmit });

    await screen.findByText("CH-TECH");
    fireEvent.change(screen.getByLabelText("Nombre del autor"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Testimonio"), {
      target: { value: "Great work." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear testimonio" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        author_name: "Jane Doe",
        content: "Great work.",
        client_id: null,
        project_id: null,
        rating: null,
        featured: false,
      }),
    );
    expect(pushMock).toHaveBeenCalledWith("/admin/testimonials");
  });

  it("prefills fields from initialValue when editing", async () => {
    renderForm({
      initialValue: existingTestimonial,
      onSubmit: vi.fn(),
      submitLabel: "Guardar cambios",
    });

    expect(await screen.findByLabelText("Nombre del autor")).toHaveValue(
      "Jane Doe",
    );
    expect(screen.getByLabelText("Testimonio")).toHaveValue("Great work.");
    expect(screen.getByLabelText("Calificación (1-5, opcional)")).toHaveValue(
      5,
    );
    expect(screen.getByLabelText("Destacado")).toBeChecked();
  });

  it("shows an error message when onSubmit rejects", async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error("No fue posible guardar el testimonio."));

    renderForm({ onSubmit });

    await screen.findByText("CH-TECH");
    fireEvent.change(screen.getByLabelText("Nombre del autor"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByLabelText("Testimonio"), {
      target: { value: "Great work." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear testimonio" }));

    expect(
      await screen.findByText("No fue posible guardar el testimonio."),
    ).toBeInTheDocument();
  });
});
