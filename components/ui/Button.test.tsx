import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button element by default", () => {
    render(<Button>Enviar</Button>);

    const button = screen.getByRole("button", { name: "Enviar" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("renders an anchor when href is provided", () => {
    render(<Button href="/contacto">Contactar</Button>);

    const link = screen.getByRole("link", { name: "Contactar" });
    expect(link).toHaveAttribute("href", "/contacto");
  });

  it("respects an explicit type override", () => {
    render(<Button type="submit">Guardar</Button>);

    expect(screen.getByRole("button", { name: "Guardar" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("forwards disabled state and click handlers", async () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Deshabilitado
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Deshabilitado" });
    expect(button).toBeDisabled();
  });

  it("applies the danger variant for destructive actions", () => {
    render(<Button variant="danger">Eliminar</Button>);

    expect(screen.getByRole("button", { name: "Eliminar" })).toHaveClass(
      "bg-danger",
    );
  });

  it("merges a custom className with the variant/size classes", () => {
    render(
      <Button variant="ghost" size="sm" className="custom-class">
        Editar
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Editar" })).toHaveClass(
      "custom-class",
      "text-accent",
    );
  });
});
