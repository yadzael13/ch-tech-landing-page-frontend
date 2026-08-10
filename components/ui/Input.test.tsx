import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders a native input with the canonical control classes", () => {
    render(<Input aria-label="Nombre" />);

    expect(screen.getByLabelText("Nombre")).toHaveClass(
      "rounded-lg",
      "border-border",
      "bg-surface",
    );
  });

  it("adds the invalid border treatment when aria-invalid is true", () => {
    render(<Input aria-label="Email" aria-invalid />);

    expect(screen.getByLabelText("Email")).toHaveClass("border-danger");
  });

  it("does not add the invalid treatment by default", () => {
    render(<Input aria-label="Email" />);

    expect(screen.getByLabelText("Email")).not.toHaveClass("border-danger");
  });

  it("forwards native input props", () => {
    render(<Input aria-label="Email" type="email" required maxLength={255} />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("maxLength", "255");
  });
});
