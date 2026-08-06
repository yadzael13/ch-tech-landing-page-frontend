import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import EditTechnologyPage from "./page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  useParams: () => ({ id: "t1" }),
}));

const existingTechnology = {
  id: "t1",
  name: "Python",
  category: "Language",
  icon: null,
  official_url: null,
};

describe("EditTechnologyPage", () => {
  it("loads and prefills the technology being edited", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/technologies/t1`, () =>
        HttpResponse.json({
          success: true,
          data: existingTechnology,
          message: null,
        }),
      ),
    );

    render(
      <AuthProvider>
        <EditTechnologyPage />
      </AuthProvider>,
    );

    expect(await screen.findByDisplayValue("Python")).toBeInTheDocument();
  });

  it("shows an error state when loading the technology fails", async () => {
    server.use(
      http.post("/api/auth/refresh", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
      http.get(`${API_URL}/technologies/t1`, () =>
        HttpResponse.json(
          {
            error: {
              code: "RESOURCE_NOT_FOUND",
              message: "Technology not found",
            },
          },
          { status: 404 },
        ),
      ),
    );

    render(
      <AuthProvider>
        <EditTechnologyPage />
      </AuthProvider>,
    );

    expect(
      await screen.findByText("No fue posible cargar la tecnología."),
    ).toBeInTheDocument();
  });
});
