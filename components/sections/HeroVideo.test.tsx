import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hero } from "@/lib/content/site";
import HeroVideo from "./HeroVideo";

const { usePrefersReducedMotionMock, useScrollDirectionMock } = vi.hoisted(
  () => ({
    usePrefersReducedMotionMock: vi.fn(() => false),
    useScrollDirectionMock: vi.fn(() => "up" as "up" | "down"),
  }),
);

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: usePrefersReducedMotionMock,
}));

vi.mock("@/lib/hooks/useScrollDirection", () => ({
  useScrollDirection: useScrollDirectionMock,
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
    useScrollDirectionMock.mockReturnValue("up");
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

  it("renders a wave divider at the foot of the hero", () => {
    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    const wave = container.querySelector("section > svg");
    expect(wave).toBeInTheDocument();
    expect(wave).toHaveClass("opacity-70");
    expect(wave?.querySelector("path")).toHaveAttribute(
      "fill",
      "var(--color-background)",
    );
  });

  it("fades the copy out while the user is scrolling down", () => {
    useScrollDirectionMock.mockReturnValue("down");

    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    expect(copyWrapper(container)).toHaveClass("opacity-0");
  });

  it("keeps the copy visible while the user is scrolling up", () => {
    useScrollDirectionMock.mockReturnValue("up");

    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    expect(copyWrapper(container)).not.toHaveClass("opacity-0");
  });

  it("never fades the copy on scroll when the user prefers reduced motion", () => {
    usePrefersReducedMotionMock.mockReturnValue(true);
    useScrollDirectionMock.mockReturnValue("down");

    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    expect(copyWrapper(container)).not.toHaveClass("opacity-0");
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
