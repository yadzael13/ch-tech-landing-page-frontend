import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field } from "./Field";
import { Input } from "./Input";

describe("Field", () => {
  it("associates the label with the control via implicit nesting", () => {
    render(
      <Field label="Nombre">
        <Input name="name" />
      </Field>,
    );

    expect(screen.getByLabelText("Nombre")).toBeInTheDocument();
  });

  it("does not mark the control invalid when there is no error", () => {
    render(
      <Field label="Nombre">
        <Input name="name" />
      </Field>,
    );

    expect(screen.getByLabelText("Nombre")).toHaveAttribute(
      "aria-invalid",
      "false",
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("wires aria-invalid and aria-describedby to the error text", () => {
    render(
      <Field label="Email" error="Formato inválido">
        <Input name="email" />
      </Field>,
    );

    const input = screen.getByLabelText("Email");
    const error = screen.getByRole("alert");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", error.id);
    expect(error).toHaveTextContent("Formato inválido");
  });
});
