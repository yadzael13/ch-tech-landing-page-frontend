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
import AdminTechnologiesPage from "./page";

function renderPage() {
  return render(
    <AuthProvider>
      <AdminTechnologiesPage />
    </AuthProvider>,
  );
}

const sampleTechnology = {
  id: "1",
  name: "Python",
  category: "Language",
  icon: null,
  official_url: null,
};

beforeEach(() => {
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json({ access_token: "tok" }),
    ),
  );
});

describe("AdminTechnologiesPage", () => {
  it("renders the list of technologies", async () => {
    server.use(
      http.get(`${API_URL}/technologies`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleTechnology],
          message: null,
        }),
      ),
    );

    renderPage();

    expect(await screen.findByText("Python")).toBeInTheDocument();
  });

  it("shows an empty state when there are no technologies", async () => {
    server.use(
      http.get(`${API_URL}/technologies`, () =>
        HttpResponse.json({ success: true, data: [], message: null }),
      ),
    );

    renderPage();

    expect(
      await screen.findByText("Aún no hay tecnologías."),
    ).toBeInTheDocument();
  });

  it("deletes a technology after confirming in the dialog", async () => {
    server.use(
      http.get(`${API_URL}/technologies`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleTechnology],
          message: null,
        }),
      ),
      http.delete(
        `${API_URL}/admin/technologies/1`,
        () => new HttpResponse(null, { status: 204 }),
      ),
    );

    renderPage();
    await screen.findByText("Python");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Eliminar" }));

    await waitFor(() =>
      expect(screen.queryByText("Python")).not.toBeInTheDocument(),
    );
  });

  it("keeps the technology when the delete dialog is cancelled", async () => {
    server.use(
      http.get(`${API_URL}/technologies`, () =>
        HttpResponse.json({
          success: true,
          data: [sampleTechnology],
          message: null,
        }),
      ),
    );

    renderPage();
    await screen.findByText("Python");

    fireEvent.click(screen.getByRole("button", { name: "Eliminar" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancelar" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
    expect(screen.getByText("Python")).toBeInTheDocument();
  });
});
