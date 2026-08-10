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
import AdminCaseStudiesPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <AdminCaseStudiesPage />
    </AuthProvider>,
  );
}

const sampleCaseStudy = {
  id: "1",
  project_id: "p1",
  challenge: "Scale to 10x traffic",
  solution: null,
  architecture: null,
  lessons_learned: null,
  metrics: null,
};

beforeEach(() => {
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
    ),
  );
});

describe("AdminCaseStudiesPage", () => {
  it("renders the list of case studies", async () => {
    server.use(
      http.get(`${API_URL}/admin/case-studies`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleCaseStudy],
          message: null,
        }),
      ),
    );

    renderPage();

    expect(await screen.findByText("Scale to 10x traffic")).toBeInTheDocument();
  });

  it("shows an empty state when there are no case studies", async () => {
    server.use(
      http.get(`${API_URL}/admin/case-studies`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    renderPage();

    expect(
      await screen.findByText("Aún no hay casos de estudio."),
    ).toBeInTheDocument();
  });

  it("deletes a case study after confirming in the dialog", async () => {
    server.use(
      http.get(`${API_URL}/admin/case-studies`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleCaseStudy],
          message: null,
        }),
      ),
      http.delete(
        `${API_URL}/admin/case-studies/1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    renderPage();
    await screen.findByText("Scale to 10x traffic");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Eliminar" }));

    await waitFor(() =>
      expect(
        screen.queryByText("Scale to 10x traffic"),
      ).not.toBeInTheDocument(),
    );
  });

  it("keeps the case study when the delete dialog is cancelled", async () => {
    server.use(
      http.get(`${API_URL}/admin/case-studies`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleCaseStudy],
          message: null,
        }),
      ),
    );

    renderPage();
    await screen.findByText("Scale to 10x traffic");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Scale to 10x traffic")).toBeInTheDocument();
  });
});
