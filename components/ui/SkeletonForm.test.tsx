import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkeletonForm } from "./SkeletonForm";

describe("SkeletonForm", () => {
  it("announces a status for screen readers", () => {
    render(<SkeletonForm />);

    expect(screen.getByRole("status")).toHaveTextContent("Cargando");
  });

  it("renders the requested number of field placeholders", () => {
    const { container } = render(<SkeletonForm fields={3} />);

    const fields = container.querySelectorAll("[aria-hidden] > div");
    expect(fields).toHaveLength(3);
  });
});
