import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CircuitBoard } from "./CircuitBoard";

const { usePrefersReducedMotionMock } = vi.hoisted(() => ({
  usePrefersReducedMotionMock: vi.fn(() => false),
}));

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: usePrefersReducedMotionMock,
}));

// Keep in sync with CircuitBoard.tsx's ENTRANCE_COMPLETE_MS
// (650 + 3 * 90 + 900).
const ENTRANCE_COMPLETE_MS = 1820;

class StubObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

type ObserverEntry = { isIntersecting: boolean; target: Element };
type ObserverCallback = (entries: ObserverEntry[]) => void;

function mockControllableObserver() {
  let latestCallback: ObserverCallback | undefined;

  class ControllableObserver {
    constructor(callback: ObserverCallback) {
      latestCallback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
  }

  vi.stubGlobal("IntersectionObserver", ControllableObserver);

  return {
    triggerIntersect(entries: ObserverEntry[]) {
      act(() => {
        latestCallback?.(entries);
      });
    },
  };
}

beforeEach(() => {
  usePrefersReducedMotionMock.mockReturnValue(false);
  vi.stubGlobal("IntersectionObserver", StubObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("CircuitBoard", () => {
  it("renders as a decorative, non-interactive layer", () => {
    const { container } = render(<CircuitBoard />);

    const root = container.firstElementChild;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root?.getAttribute("class")).toContain("pointer-events-none");
    expect(root?.getAttribute("class")).toContain("-z-10");
  });

  it("renders one independently-positioned SVG per cluster, anchored near a viewport edge", () => {
    const { container } = render(<CircuitBoard />);

    const svgs = [...container.querySelectorAll("svg")];
    expect(svgs).toHaveLength(2);
    svgs.forEach((svg) => {
      const style = svg.getAttribute("style") ?? "";
      // Every pocket is anchored from at least one true edge (left/right),
      // never positioned via page-wide viewBox percentages.
      expect(style).toMatch(/left|right/);
    });
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

  it("draws every trace undrawn with a staggered animation delay before the entrance completes", () => {
    const { container } = render(<CircuitBoard />);
    const paths = container.querySelectorAll("path");

    expect(paths.length).toBeGreaterThan(0);
    paths.forEach((path) => {
      expect(
        (path as SVGPathElement).classList.contains("animate-circuit-draw"),
      ).toBe(true);
      expect(path.getAttribute("style")).toMatch(/animation-delay/);
      expect(path.getAttribute("stroke-dashoffset")).toBe("1");
    });
  });

  it("shows no glints before the entrance completes", () => {
    const { container } = render(<CircuitBoard />);

    expect(
      container.querySelectorAll("circle.animate-circuit-travel"),
    ).toHaveLength(0);
  });

  it("connects the active cluster and retracts the others once the entrance completes", () => {
    vi.useFakeTimers();
    const { container } = render(<CircuitBoard />);

    act(() => {
      vi.advanceTimersByTime(ENTRANCE_COMPLETE_MS);
    });

    const paths = [...container.querySelectorAll("path")];
    expect(paths.length).toBeGreaterThan(0);
    paths.forEach((path) => {
      expect((path as SVGPathElement).classList.contains("circuit-trace")).toBe(
        true,
      );
      expect(
        (path as SVGPathElement).classList.contains("animate-circuit-draw"),
      ).toBe(false);
      expect(path.getAttribute("style") ?? "").not.toMatch(/animation-delay/);
    });

    // Default active cluster (activeIndex 0, before any real intersection)
    // is the first cluster ("top-left") — its traces connect (0); every
    // other cluster retracts to the partial resting offset.
    const clusters = [...container.querySelectorAll("g.circuit-cluster")];
    clusters[0]!
      .querySelectorAll("path")
      .forEach((path) =>
        expect(path.getAttribute("stroke-dashoffset")).toBe("0"),
      );
    clusters
      .slice(1)
      .forEach((cluster) =>
        cluster
          .querySelectorAll("path")
          .forEach((path) =>
            expect(path.getAttribute("stroke-dashoffset")).toBe("0.45"),
          ),
      );
  });

  it("shows exactly one glint, riding the active cluster, once connected", () => {
    vi.useFakeTimers();
    const { container } = render(<CircuitBoard />);

    act(() => {
      vi.advanceTimersByTime(ENTRANCE_COMPLETE_MS);
    });

    expect(
      container.querySelectorAll("circle.animate-circuit-travel"),
    ).toHaveLength(1);
  });

  it("renders no glints and no draw-in/retract motion when reduced motion is preferred", () => {
    usePrefersReducedMotionMock.mockReturnValue(true);
    vi.useFakeTimers();

    const { container } = render(<CircuitBoard />);
    act(() => {
      vi.advanceTimersByTime(ENTRANCE_COMPLETE_MS);
    });

    const glints = container.querySelectorAll("circle.animate-circuit-travel");
    const paths = container.querySelectorAll("path");

    expect(glints).toHaveLength(0);
    paths.forEach((path) => {
      expect(
        (path as SVGPathElement).classList.contains("animate-circuit-draw"),
      ).toBe(false);
      expect((path as SVGPathElement).classList.contains("circuit-trace")).toBe(
        false,
      );
      expect(path.getAttribute("style")).toBeNull();
      expect(path.getAttribute("stroke-dashoffset")).toBe("0");
    });
  });

  it("exposes the scroll energy as a CSS custom property, peaking at the first and last section and settling in between", () => {
    const { triggerIntersect } = mockControllableObserver();

    const { container, getByTestId } = render(
      <div id="main-content">
        <CircuitBoard />
        <section data-testid="s0" />
        <section data-testid="s1" />
        <section data-testid="s2" />
        <section data-testid="s3" />
        <section data-testid="s4" />
      </div>,
    );
    // --circuit-energy lives on the wrapping div (it inherits down to every
    // pocket's <g> through the CSS cascade) rather than on any individual
    // per-cluster SVG.
    const root = container.querySelector("#main-content > div")!;

    // Real IntersectionObservers report each target's initial intersection
    // shortly after observe() — simulate the browser reporting Hero (s0) as
    // intersecting first, which also establishes sectionCount.
    triggerIntersect([{ isIntersecting: true, target: getByTestId("s0") }]);
    expect(root.getAttribute("style")).toMatch(/--circuit-energy:\s*1/);

    triggerIntersect([
      { isIntersecting: false, target: getByTestId("s0") },
      { isIntersecting: true, target: getByTestId("s3") },
    ]);
    expect(root.getAttribute("style")).toMatch(/--circuit-energy:\s*0[^.]/);

    triggerIntersect([
      { isIntersecting: false, target: getByTestId("s3") },
      { isIntersecting: true, target: getByTestId("s4") },
    ]);
    expect(root.getAttribute("style")).toMatch(/--circuit-energy:\s*1/);
  });
});
