import { fireEvent, render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { server } from "@/test/msw-server";
import { AuthProvider } from "@/lib/auth/AuthContext";
import AdminLoginPage from "./page";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock, replace: vi.fn() }),
}));

function renderPage() {
  return render(
    <AuthProvider>
      <AdminLoginPage />
    </AuthProvider>,
  );
}

beforeEach(() => {
  pushMock.mockClear();
  // Every render mounts AuthProvider, which always attempts a silent
  // refresh — default it to "no session" unless a test overrides it.
  server.use(
    http.post("/api/auth/refresh", () =>
      HttpResponse.json(
        { error: { code: "UNAUTHORIZED", message: "No active session" } },
        { status: 401 },
      ),
    ),
  );
});

function fillForm() {
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "admin@ch-tech.dev" },
  });
  fireEvent.change(screen.getByLabelText("Contraseña"), {
    target: { value: "s3cret-pass" },
  });
}

describe("AdminLoginPage", () => {
  it("redirects to /admin on successful login", async () => {
    server.use(
      http.post("/api/auth/login", () =>
        HttpResponse.json({ access_token: "tok" }),
      ),
    );

    renderPage();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    await vi.waitFor(() => expect(pushMock).toHaveBeenCalledWith("/admin"));
  });

  it("shows an error message on invalid credentials", async () => {
    server.use(
      http.post("/api/auth/login", () =>
        HttpResponse.json(
          {
            error: {
              code: "UNAUTHORIZED",
              message: "Invalid email or password",
            },
          },
          { status: 401 },
        ),
      ),
    );

    renderPage();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(
      await screen.findByText("Email o contraseña incorrectos."),
    ).toBeInTheDocument();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("shows a rate-limit specific message on 429", async () => {
    server.use(
      http.post("/api/auth/login", () =>
        HttpResponse.json(
          {
            error: {
              code: "RATE_LIMIT_EXCEEDED",
              message: "Too many requests",
            },
          },
          { status: 429 },
        ),
      ),
    );

    renderPage();
    fillForm();
    fireEvent.click(screen.getByRole("button", { name: "Ingresar" }));

    expect(
      await screen.findByText(
        "Demasiados intentos. Espera unos minutos antes de volver a intentar.",
      ),
    ).toBeInTheDocument();
  });
});
