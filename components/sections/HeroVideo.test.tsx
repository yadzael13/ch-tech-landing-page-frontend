import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hero } from "@/lib/content/site";
import HeroVideo from "./HeroVideo";

const { usePrefersReducedMotionMock, useScrollFadeMock } = vi.hoisted(() => ({
  usePrefersReducedMotionMock: vi.fn(() => false),
  useScrollFadeMock: vi.fn(() => 1),
}));

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: usePrefersReducedMotionMock,
}));

vi.mock("@/lib/hooks/useScrollFade", () => ({
  useScrollFade: useScrollFadeMock,
}));

function visibleHeadline() {
  return document.querySelector('h1 span[aria-hidden="true"]');
}

function copyWrapper(container: HTMLElement) {
  return container.querySelector(".bg-grid > div");
}

describe("HeroVideo", () => {
  beforeEach(() => {
    usePrefersReducedMotionMock.mockReturnValue(false);
    useScrollFadeMock.mockReturnValue(1);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders the headline (as its accessible name), subtext and CTAs passed in", () => {
    render(<HeroVideo headline="Headline" subtext="Subtext" />);

    expect(
      screen.getByRole("heading", { name: "Headline" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Subtext")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: hero.primaryCta.label }),
    ).toHaveAttribute("href", hero.primaryCta.href);
    expect(
      screen.getByRole("link", { name: hero.secondaryCta.label }),
    ).toHaveAttribute("href", hero.secondaryCta.href);
  });

  it("types the headline out over time when motion is not reduced", () => {
    vi.useFakeTimers();
    render(<HeroVideo headline="Hi" subtext="Subtext" />);

    // The accessible name is the full headline from the very first render...
    expect(screen.getByRole("heading", { name: "Hi" })).toBeInTheDocument();
    // ...but the visible, animated copy starts empty and fills in over time.
    expect(visibleHeadline()).toHaveTextContent("");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(visibleHeadline()).toHaveTextContent("Hi");
  });

  it("shows the full headline immediately, with no typing animation, when motion is reduced", () => {
    usePrefersReducedMotionMock.mockReturnValue(true);

    render(<HeroVideo headline="Hi" subtext="Subtext" />);

    expect(visibleHeadline()).toHaveTextContent("Hi");
  });

  it("autoplays and loops the video natively when motion is not reduced", () => {
    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    const video = container.querySelector("video");
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("loop");
  });

  it("never autoplays or loops the video when the user prefers reduced motion", () => {
    usePrefersReducedMotionMock.mockReturnValue(true);

    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    const video = container.querySelector("video");
    expect(video).not.toHaveAttribute("autoplay");
    expect(video).not.toHaveAttribute("loop");
  });

  it("renders a wave divider straddling the hero's bottom edge", () => {
    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    const wave = container.querySelector("section > svg");
    expect(wave).toBeInTheDocument();
    expect(wave).toHaveClass("opacity-70", "bottom-0", "translate-y-1/2");
    expect(wave?.querySelector("path")).toHaveAttribute(
      "fill",
      "var(--color-background)",
    );
  });

  it("plays the video at half speed", () => {
    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    expect(container.querySelector("video")).toHaveProperty(
      "playbackRate",
      0.5,
    );
  });

  it("ties the copy's opacity directly to the scroll-fade value", () => {
    useScrollFadeMock.mockReturnValue(0.4);

    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    expect(copyWrapper(container)).toHaveStyle({ opacity: "0.4" });
  });

  it("disables pointer events only once fully faded out", () => {
    useScrollFadeMock.mockReturnValue(0);

    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    expect(copyWrapper(container)).toHaveClass("pointer-events-none");
  });

  it("keeps the copy fully visible regardless of scroll when the user prefers reduced motion", () => {
    usePrefersReducedMotionMock.mockReturnValue(true);
    useScrollFadeMock.mockReturnValue(0);

    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    expect(copyWrapper(container)).toHaveStyle({ opacity: "1" });
  });

  it("marks the video as decorative for assistive technology", () => {
    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    expect(container.querySelector("video")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("gives the info panel a near-black grid background matching the video, not the page's flat background", () => {
    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    const panel = container.querySelector(".bg-grid");
    expect(panel).toBeInTheDocument();
    expect(panel).toContainElement(screen.getByText("Subtext"));
  });
});
