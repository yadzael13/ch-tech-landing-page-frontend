import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { CaseStudyItem } from "@/lib/api/types";
import CaseStudyForm from "./CaseStudyForm";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

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

const existingCaseStudy: CaseStudyItem = {
  id: "cs1",
  project_id: "p1",
  challenge: "Scale to 10x traffic",
  solution: "Horizontal scaling",
  architecture: null,
  lessons_learned: null,
  metrics: { uptime: "99.9%" },
};

function renderForm(
  props: Partial<React.ComponentProps<typeof CaseStudyForm>> & {
    onSubmit: React.ComponentProps<typeof CaseStudyForm>["onSubmit"];
  },
) {
  return render(
    <AuthProvider>
      <CaseStudyForm submitLabel="Crear caso de estudio" {...props} />
    </AuthProvider>,
  );
}

beforeEach(() => {
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
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

describe("CaseStudyForm", () => {
  it("submits the expected payload shape and redirects on success", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);

    renderForm({ onSubmit });

    await screen.findByText("CH-TECH");
    fireEvent.change(screen.getByLabelText("Proyecto"), {
      target: { value: "p1" },
    });
    fireEvent.change(screen.getByLabelText("Desafío"), {
      target: { value: "Scale" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Crear caso de estudio" }),
    );

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ project_id: "p1", challenge: "Scale" }),
    );
    expect(pushMock).toHaveBeenCalledWith("/admin/case-studies");
  });

  it("prefills fields from initialValue when editing", async () => {
    renderForm({
      initialValue: existingCaseStudy,
      onSubmit: vi.fn(),
      submitLabel: "Guardar cambios",
    });

    expect(await screen.findByLabelText("Desafío")).toHaveValue(
      "Scale to 10x traffic",
    );
    expect(screen.getByLabelText("Métricas (JSON)")).toHaveValue(
      JSON.stringify({ uptime: "99.9%" }, null, 2),
    );
  });

  it("shows an error and does not submit when metrics is invalid JSON", async () => {
    const onSubmit = vi.fn();

    renderForm({ onSubmit });

    await screen.findByText("CH-TECH");
    fireEvent.change(screen.getByLabelText("Proyecto"), {
      target: { value: "p1" },
    });
    fireEvent.change(screen.getByLabelText("Métricas (JSON)"), {
      target: { value: "{not valid json" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Crear caso de estudio" }),
    );

    expect(
      await screen.findByText(/Metrics debe ser JSON válido/),
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
