import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, cardClassName } from "./Card";

describe("Card", () => {
  it("renders a div with the canonical surface classes by default", () => {
    render(<Card>Contenido</Card>);

    const node = screen.getByText("Contenido");
    expect(node.tagName).toBe("DIV");
    expect(node).toHaveClass("rounded-2xl", "border-border", "bg-surface");
  });

  it("renders the tag passed via `as`", () => {
    render(<Card as="article">Contenido</Card>);

    expect(screen.getByText("Contenido").tagName).toBe("ARTICLE");
  });

  it("adds hover treatment only when interactive", () => {
    render(<Card interactive>Hover</Card>);

    expect(screen.getByText("Hover")).toHaveClass("hover:border-accent");
  });

  it("does not add hover treatment by default", () => {
    render(<Card>Sin hover</Card>);

    expect(screen.getByText("Sin hover")).not.toHaveClass(
      "hover:border-accent",
    );
  });

  it("merges a custom className", () => {
    render(<Card className="custom">Texto</Card>);

    expect(screen.getByText("Texto")).toHaveClass("custom");
  });
});

describe("cardClassName", () => {
  it("returns the base classes with no arguments", () => {
    expect(cardClassName()).toContain("rounded-2xl");
  });

  it("adds hover treatment only when interactive", () => {
    expect(cardClassName({ interactive: true })).toContain(
      "hover:border-accent",
    );
    expect(cardClassName({ interactive: false })).not.toContain(
      "hover:border-accent",
    );
  });

  it("merges a custom className", () => {
    expect(cardClassName({ className: "custom" })).toContain("custom");
  });
});
