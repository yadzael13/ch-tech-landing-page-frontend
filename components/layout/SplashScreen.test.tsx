import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SplashScreen } from "./SplashScreen";

const { usePrefersReducedMotionMock } = vi.hoisted(() => ({
  usePrefersReducedMotionMock: vi.fn(() => false),
}));

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: usePrefersReducedMotionMock,
}));

const SESSION_KEY = "ch-tech-splash-shown";

beforeEach(() => {
  sessionStorage.clear();
  usePrefersReducedMotionMock.mockReturnValue(false);
});

afterEach(() => {
  vi.useRealTimers();
});

describe("SplashScreen", () => {
  it("does not render when already shown earlier this session", () => {
    sessionStorage.setItem(SESSION_KEY, "1");

    render(<SplashScreen />);

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows once, then exits and marks sessionStorage after the full cycle", () => {
    vi.useFakeTimers();

    render(<SplashScreen />);
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();

    act(() => {
      vi.advanceTimersByTime(800);
    });
    // Exit animation is playing but the overlay is still mounted.
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(sessionStorage.getItem(SESSION_KEY)).toBeNull();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(sessionStorage.getItem(SESSION_KEY)).toBe("1");
  });

  it("shortens the display and exit duration when reduced motion is preferred", () => {
    usePrefersReducedMotionMock.mockReturnValue(true);
    vi.useFakeTimers();

    render(<SplashScreen />);
    expect(screen.getByRole("status")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(80);
    });
    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("moves focus into the overlay once shown", () => {
    vi.useFakeTimers();
    const { container } = render(<SplashScreen />);

    expect(container.firstChild).toHaveFocus();
  });

  it("does not render again on a second mount within the same session", () => {
    vi.useFakeTimers();

    const { unmount } = render(<SplashScreen />);
    act(() => {
      vi.advanceTimersByTime(800);
    });
    act(() => {
      vi.advanceTimersByTime(500);
    });
    unmount();

    render(<SplashScreen />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
