import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("renders the message with role=alert for assistive tech", () => {
    render(<ErrorState message="No fue posible cargar los clientes." />);

    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("No fue posible cargar los clientes.");
    expect(alert).toHaveClass("text-danger");
  });
});
