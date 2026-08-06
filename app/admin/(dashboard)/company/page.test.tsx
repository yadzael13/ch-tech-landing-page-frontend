import { fireEvent, render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import AdminCompanyPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <AdminCompanyPage />
    </AuthProvider>,
  );
}

const sampleCompany = {
  id: "1",
  legal_name: "CH-TECH S.A. de C.V.",
  display_name: "CH-TECH",
  tagline: "Ingeniería de software e IA.",
  mission: null,
  vision: null,
  email: null,
  phone: null,
  address: null,
  social_links: null,
};

beforeEach(() => {
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
    ),
  );
});

describe("AdminCompanyPage", () => {
  it("loads and prefills the company profile", async () => {
    server.use(
      http.get(`${API_URL}/company`, () =>
        HttpResponse.json({
          success: true,
          data: sampleCompany,
          message: null,
        }),
      ),
    );

    renderPage();

    expect(
      await screen.findByDisplayValue("CH-TECH S.A. de C.V."),
    ).toBeInTheDocument();
  });

  it("renders an empty form when the company has never been seeded (404)", async () => {
    server.use(
      http.get(`${API_URL}/company`, () =>
        HttpResponse.json(
          { error: { code: "RESOURCE_NOT_FOUND", message: "Not found" } },
          { status: 404 },
        ),
      ),
    );

    renderPage();

    expect(
      await screen.findByRole("button", { name: "Guardar cambios" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Razón social")).toHaveValue("");
  });

  it("shows an error state on unexpected failures", async () => {
    server.use(
      http.get(`${API_URL}/company`, () =>
        HttpResponse.json(
          { error: { code: "INTERNAL_ERROR", message: "Boom" } },
          { status: 500 },
        ),
      ),
    );

    renderPage();

    expect(
      await screen.findByText("No fue posible cargar los datos de la empresa."),
    ).toBeInTheDocument();
  });

  it("saves changes via PUT /admin/company", async () => {
    server.use(
      http.get(`${API_URL}/company`, () =>
        HttpResponse.json({
          success: true,
          data: sampleCompany,
          message: null,
        }),
      ),
      http.put(`${API_URL}/admin/company`, () =>
        HttpResponse.json({
          success: true,
          data: { ...sampleCompany, tagline: "Nuevo tagline" },
          message: null,
        }),
      ),
    );

    renderPage();
    await screen.findByDisplayValue("CH-TECH S.A. de C.V.");

    fireEvent.click(screen.getByRole("button", { name: "Guardar cambios" }));

    expect(await screen.findByText("Cambios guardados.")).toBeInTheDocument();
  });
});
