import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useScrollReveal } from "./useScrollReveal";

type ObserverCallback = (
  entries: Pick<IntersectionObserverEntry, "isIntersecting">[],
) => void;

function mockIntersectionObserver() {
  let latestCallback: ObserverCallback | undefined;
  const disconnect = vi.fn();
  const observe = vi.fn();

  class MockObserver {
    constructor(callback: ObserverCallback) {
      latestCallback = callback;
    }
    observe = observe;
    unobserve = vi.fn();
    disconnect = disconnect;
    takeRecords = vi.fn(() => []);
  }

  vi.stubGlobal("IntersectionObserver", MockObserver);

  return {
    triggerIntersect(isIntersecting: boolean) {
      act(() => {
        latestCallback?.([{ isIntersecting }]);
      });
    },
    disconnect,
    observe,
  };
}

function RevealProbe({ once }: { once?: boolean } = {}) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ once });
  return <div ref={ref}>{isVisible ? "visible" : "hidden"}</div>;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useScrollReveal", () => {
  it("hides after mount, then reveals once the element intersects", () => {
    const { triggerIntersect, observe, disconnect } =
      mockIntersectionObserver();

    render(<RevealProbe />);

    expect(screen.getByText("hidden")).toBeInTheDocument();
    expect(observe).toHaveBeenCalledTimes(1);

    triggerIntersect(true);

    expect(screen.getByText("visible")).toBeInTheDocument();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("does not re-hide once already revealed", () => {
    const { triggerIntersect } = mockIntersectionObserver();

    render(<RevealProbe />);
    triggerIntersect(true);
    triggerIntersect(false);

    expect(screen.getByText("visible")).toBeInTheDocument();
  });

  it("falls back to visible when IntersectionObserver is unsupported", () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    render(<RevealProbe />);

    expect(screen.getByText("visible")).toBeInTheDocument();
  });

  describe("once: false", () => {
    it("keeps observing, toggling visible/hidden every time intersection changes", () => {
      const { triggerIntersect, observe, disconnect } =
        mockIntersectionObserver();

      render(<RevealProbe once={false} />);
      expect(screen.getByText("hidden")).toBeInTheDocument();
      expect(observe).toHaveBeenCalledTimes(1);

      triggerIntersect(true);
      expect(screen.getByText("visible")).toBeInTheDocument();
      expect(disconnect).not.toHaveBeenCalled();

      triggerIntersect(false);
      expect(screen.getByText("hidden")).toBeInTheDocument();

      triggerIntersect(true);
      expect(screen.getByText("visible")).toBeInTheDocument();
      expect(disconnect).not.toHaveBeenCalled();
    });
  });
});
