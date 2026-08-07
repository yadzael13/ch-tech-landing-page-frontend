import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkeletonTable } from "./SkeletonTable";

describe("SkeletonTable", () => {
  it("announces a status for screen readers", () => {
    render(<SkeletonTable />);

    expect(screen.getByRole("status")).toHaveTextContent("Cargando");
  });

  it("renders the requested number of rows and columns as decorative bars", () => {
    const { container } = render(<SkeletonTable rows={2} columns={3} />);

    const rows = container.querySelectorAll("[aria-hidden] > .divide-y > div");
    expect(rows).toHaveLength(2);
    expect(rows[0]?.children).toHaveLength(3);
  });

  it("accepts a custom label", () => {
    render(<SkeletonTable label="Cargando clientes" />);

    expect(screen.getByRole("status")).toHaveTextContent("Cargando clientes");
  });
});
