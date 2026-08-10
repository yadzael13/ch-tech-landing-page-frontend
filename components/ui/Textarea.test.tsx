import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Textarea } from "./Textarea";

describe("Textarea", () => {
  it("renders a native textarea with the canonical control classes", () => {
    render(<Textarea aria-label="Mensaje" />);

    expect(screen.getByLabelText("Mensaje")).toHaveClass(
      "rounded-lg",
      "border-border",
      "bg-surface",
    );
  });

  it("adds the invalid border treatment when aria-invalid is true", () => {
    render(<Textarea aria-label="Mensaje" aria-invalid />);

    expect(screen.getByLabelText("Mensaje")).toHaveClass("border-danger");
  });

  it("forwards native textarea props", () => {
    render(<Textarea aria-label="Mensaje" maxLength={5000} required />);

    const textarea = screen.getByLabelText("Mensaje");
    expect(textarea).toHaveAttribute("maxLength", "5000");
    expect(textarea).toBeRequired();
  });
});
