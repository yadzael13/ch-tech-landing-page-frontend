import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Reveal } from "./Reveal";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Reveal", () => {
  it("renders a div by default with fade-in-up once IntersectionObserver is unavailable", () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    render(<Reveal>Contenido</Reveal>);

    const node = screen.getByText("Contenido");
    expect(node.tagName).toBe("DIV");
    expect(node).toHaveClass("animate-fade-in-up");
  });

  it("renders the tag passed via `as`", () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    render(
      <ul>
        <Reveal as="li">Item</Reveal>
      </ul>,
    );

    expect(screen.getByText("Item").tagName).toBe("LI");
  });

  it("applies the stagger delay as inline animation-delay", () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    render(<Reveal delayMs={120}>Con retraso</Reveal>);

    expect(screen.getByText("Con retraso")).toHaveStyle({
      animationDelay: "120ms",
    });
  });

  it("merges a custom className", () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    render(<Reveal className="custom">Texto</Reveal>);

    expect(screen.getByText("Texto")).toHaveClass("custom");
  });
});
