import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("announces via role=status with a default label", () => {
    render(<Spinner />);

    expect(screen.getByRole("status")).toHaveTextContent("Cargando");
  });

  it("accepts a custom label", () => {
    render(<Spinner label="Verificando sesión" />);

    expect(screen.getByRole("status")).toHaveTextContent("Verificando sesión");
  });
});
