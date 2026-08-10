import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useActiveSection } from "./useActiveSection";

type ObserverEntry = { isIntersecting: boolean; target: Element };
type ObserverCallback = (entries: ObserverEntry[]) => void;

function mockIntersectionObserver() {
  let latestCallback: ObserverCallback | undefined;
  let instanceCount = 0;
  const disconnect = vi.fn();
  const observe = vi.fn();

  class MockObserver {
    constructor(callback: ObserverCallback) {
      latestCallback = callback;
      instanceCount += 1;
    }
    observe = observe;
    unobserve = vi.fn();
    disconnect = disconnect;
    takeRecords = vi.fn(() => []);
  }

  vi.stubGlobal("IntersectionObserver", MockObserver);

  return {
    triggerIntersect(entries: ObserverEntry[]) {
      act(() => {
        latestCallback?.(entries);
      });
    },
    get instanceCount() {
      return instanceCount;
    },
    disconnect,
    observe,
  };
}

function ActiveSectionProbe() {
  const { activeIndex, sectionCount } = useActiveSection();
  return (
    <div>
      <div data-testid="active-index">{activeIndex}</div>
      <div data-testid="section-count">{sectionCount}</div>
    </div>
  );
}

function renderWithSections(count: number) {
  return render(
    <div id="main-content">
      <ActiveSectionProbe />
      {Array.from({ length: count }, (_, index) => (
        <section key={index} data-testid={`section-${index}`} />
      ))}
    </div>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useActiveSection", () => {
  it("defaults to index 0 and section count 0 before any intersection fires", () => {
    mockIntersectionObserver();

    const { getByTestId } = renderWithSections(3);

    expect(getByTestId("active-index")).toHaveTextContent("0");
    expect(getByTestId("section-count")).toHaveTextContent("0");
  });

  it("reports how many top-level sections it found once the observer reports in", () => {
    const { triggerIntersect, observe } = mockIntersectionObserver();

    const { getByTestId } = renderWithSections(7);
    // Real IntersectionObservers report each target's initial intersection
    // shortly after observe() — simulate that here rather than reading
    // sectionCount before any callback has fired.
    triggerIntersect([
      { isIntersecting: true, target: getByTestId("section-0") },
    ]);

    expect(observe).toHaveBeenCalledTimes(7);
    expect(getByTestId("section-count")).toHaveTextContent("7");
  });

  it("creates exactly one IntersectionObserver regardless of section count", () => {
    const observer = mockIntersectionObserver();

    renderWithSections(5);

    expect(observer.instanceCount).toBe(1);
  });

  it("observes every top-level section once", () => {
    const { observe } = mockIntersectionObserver();

    renderWithSections(4);

    expect(observe).toHaveBeenCalledTimes(4);
  });

  it("updates the active index as different sections intersect, without ever disconnecting", () => {
    const { triggerIntersect, disconnect } = mockIntersectionObserver();

    const { getByTestId } = renderWithSections(3);
    const sections: [HTMLElement, HTMLElement, HTMLElement] = [
      getByTestId("section-0"),
      getByTestId("section-1"),
      getByTestId("section-2"),
    ];

    triggerIntersect([{ isIntersecting: true, target: sections[1] }]);
    expect(getByTestId("active-index")).toHaveTextContent("1");
    expect(disconnect).not.toHaveBeenCalled();

    triggerIntersect([
      { isIntersecting: false, target: sections[1] },
      { isIntersecting: true, target: sections[2] },
    ]);
    expect(getByTestId("active-index")).toHaveTextContent("2");
    expect(disconnect).not.toHaveBeenCalled();
  });

  it("keeps the last known active index when nothing currently intersects", () => {
    const { triggerIntersect } = mockIntersectionObserver();

    const { getByTestId } = renderWithSections(2);
    const sections: [HTMLElement, HTMLElement] = [
      getByTestId("section-0"),
      getByTestId("section-1"),
    ];

    triggerIntersect([{ isIntersecting: true, target: sections[1] }]);
    expect(getByTestId("active-index")).toHaveTextContent("1");

    triggerIntersect([{ isIntersecting: false, target: sections[1] }]);
    expect(getByTestId("active-index")).toHaveTextContent("1");
  });

  it("disconnects on unmount", () => {
    const { disconnect } = mockIntersectionObserver();

    const { unmount } = renderWithSections(2);
    unmount();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it("falls back to index 0 and section count 0 when IntersectionObserver is unsupported", () => {
    vi.stubGlobal("IntersectionObserver", undefined);

    const { getByTestId } = renderWithSections(3);

    expect(getByTestId("active-index")).toHaveTextContent("0");
    expect(getByTestId("section-count")).toHaveTextContent("0");
  });
});
