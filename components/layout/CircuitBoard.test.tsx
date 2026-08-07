import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CircuitBoard } from "./CircuitBoard";

const { usePrefersReducedMotionMock } = vi.hoisted(() => ({
  usePrefersReducedMotionMock: vi.fn(() => false),
}));

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: usePrefersReducedMotionMock,
}));

class StubObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

beforeEach(() => {
  usePrefersReducedMotionMock.mockReturnValue(false);
  vi.stubGlobal("IntersectionObserver", StubObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("CircuitBoard", () => {
  it("renders as a decorative, non-interactive layer", () => {
    const { container } = render(<CircuitBoard />);

    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg?.getAttribute("class")).toContain("pointer-events-none");
    expect(svg?.getAttribute("class")).toContain("-z-10");
  });

  it("mounts cleanly inside a #main-content section fixture", () => {
    expect(() =>
      render(
        <div id="main-content">
          <CircuitBoard />
          <section />
          <section />
        </div>,
      ),
    ).not.toThrow();
  });

  it("draws every trace with a staggered animation delay when motion is allowed", () => {
    usePrefersReducedMotionMock.mockReturnValue(false);

    const { container } = render(<CircuitBoard />);
    const paths = container.querySelectorAll("path");

    expect(paths.length).toBeGreaterThan(0);
    paths.forEach((path) => {
      expect(
        (path as SVGPathElement).classList.contains("animate-circuit-draw"),
      ).toBe(true);
      expect(path.getAttribute("style")).toMatch(/animation-delay/);
    });
  });

  it("renders exactly 3 traveling glints when motion is allowed", () => {
    usePrefersReducedMotionMock.mockReturnValue(false);

    const { container } = render(<CircuitBoard />);
    const glints = container.querySelectorAll("circle.animate-circuit-travel");

    expect(glints).toHaveLength(3);
  });

  it("renders no glints and no draw-in delay when reduced motion is preferred", () => {
    usePrefersReducedMotionMock.mockReturnValue(true);

    const { container } = render(<CircuitBoard />);
    const glints = container.querySelectorAll("circle.animate-circuit-travel");
    const paths = container.querySelectorAll("path");

    expect(glints).toHaveLength(0);
    paths.forEach((path) => {
      expect(
        (path as SVGPathElement).classList.contains("animate-circuit-draw"),
      ).toBe(false);
      expect(path.getAttribute("style")).toBeNull();
      expect(path.getAttribute("stroke-dashoffset")).toBe("0");
    });
  });
});
