import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import Contact from "./Contact";

const VALID_MESSAGE = "A message that is definitely long enough to be valid.";

function fillValidForm() {
  fireEvent.change(screen.getByLabelText("Nombre"), {
    target: { value: "Ada Lovelace" },
  });
  fireEvent.change(screen.getByLabelText("Email"), {
    target: { value: "ada@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Mensaje"), {
    target: { value: VALID_MESSAGE },
  });
}

describe("Contact", () => {
  it("submits successfully and shows a confirmation message", async () => {
    server.use(
      http.post(`${API_URL}/contact`, () =>
        HttpResponse.json(
          { message: "Contact request received." },
          { status: 201 },
        ),
      ),
    );

    render(<Contact />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(
        "Mensaje enviado. Te responderemos pronto.",
      ),
    );
  });

  it("blocks submission client-side when the message is too short", async () => {
    render(<Contact />);
    fireEvent.change(screen.getByLabelText("Nombre"), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Mensaje"), {
      target: { value: "too short" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    // No MSW handler is registered for POST /contact here — if the component
    // sent a request anyway, the onUnhandledRequest: "error" setup would fail
    // this test, proving the short-message guard runs before any fetch.
    const fieldError = await screen.findByText(
      "El mensaje debe tener entre 20 y 5000 caracteres.",
    );
    expect(fieldError).toBeInTheDocument();

    const messageField = screen.getByLabelText("Mensaje");
    expect(messageField).toHaveAttribute("aria-invalid", "true");
    expect(messageField).toHaveAttribute("aria-describedby", fieldError.id);
  });

  it("shows a rate-limit specific message on 429", async () => {
    server.use(
      http.post(`${API_URL}/contact`, () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              code: "RATE_LIMIT_EXCEEDED",
              message: "Too many requests",
            },
          },
          { status: 429 },
        ),
      ),
    );

    render(<Contact />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(
      await screen.findByText(
        "Has alcanzado el límite de solicitudes. Intenta de nuevo más tarde.",
      ),
    ).toBeInTheDocument();
  });

  it("shows the server error message on other API errors", async () => {
    server.use(
      http.post(`${API_URL}/contact`, () =>
        HttpResponse.json(
          {
            success: false,
            error: {
              code: "VALIDATION_ERROR",
              message: "Invalid request data",
            },
          },
          { status: 422 },
        ),
      ),
    );

    render(<Contact />);
    fillValidForm();
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(await screen.findByText("Invalid request data")).toBeInTheDocument();
  });
});
