import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { ProjectDetail } from "@/lib/api/types";
import ProjectForm from "./ProjectForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

function mockTechnologies() {
  server.use(
    http.get(`${API_URL}/technologies`, () =>
      HttpResponse.json({
        success: true,
        data: [
          {
            id: "1",
            name: "Python",
            category: null,
            icon: null,
            official_url: null,
          },
        ],
        message: null,
      }),
    ),
  );
}

const existingProject: ProjectDetail = {
  id: "p1",
  slug: "existing",
  title: "Existing Project",
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

describe("ProjectForm", () => {
  it("submits the expected payload shape and redirects on success", async () => {
    mockTechnologies();
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ProjectForm onSubmit={onSubmit} submitLabel="Crear proyecto" />);

    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "CH-TECH" },
    });
    fireEvent.change(screen.getByLabelText("Slug"), {
      target: { value: "ch-tech" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear proyecto" }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "CH-TECH",
        slug: "ch-tech",
        status: "PLANNING",
        visibility: "PRIVATE",
        featured: false,
      }),
    );
    expect(pushMock).toHaveBeenCalledWith("/admin/projects");
  });

  it("prefills fields from initialValue when editing", () => {
    mockTechnologies();

    render(
      <ProjectForm
        initialValue={existingProject}
        onSubmit={vi.fn()}
        submitLabel="Guardar cambios"
      />,
    );

    expect(screen.getByLabelText("Título")).toHaveValue("Existing Project");
    expect(screen.getByLabelText("Slug")).toHaveValue("existing");
  });

  it("shows an error message when onSubmit rejects", async () => {
    mockTechnologies();
    const onSubmit = vi
      .fn()
      .mockRejectedValue(new Error("A project with this slug already exists"));

    render(<ProjectForm onSubmit={onSubmit} submitLabel="Crear proyecto" />);
    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Dup" },
    });
    fireEvent.change(screen.getByLabelText("Slug"), {
      target: { value: "dup" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Crear proyecto" }));

    expect(
      await screen.findByText("A project with this slug already exists"),
    ).toBeInTheDocument();
  });
});
