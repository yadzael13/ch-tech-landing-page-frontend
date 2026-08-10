import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders the message as plain muted text", () => {
    render(<EmptyState message="Aún no hay clientes." />);

    expect(screen.getByText("Aún no hay clientes.")).toHaveClass("text-muted");
  });
});
