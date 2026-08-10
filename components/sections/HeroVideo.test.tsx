import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hero } from "@/lib/content/site";
import HeroVideo from "./HeroVideo";

const { usePrefersReducedMotionMock, useScrollScrubMock } = vi.hoisted(() => ({
  usePrefersReducedMotionMock: vi.fn(() => false),
  useScrollScrubMock: vi.fn(() => ({ isSettled: false })),
}));

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: usePrefersReducedMotionMock,
}));

vi.mock("@/lib/hooks/useScrollScrub", () => ({
  useScrollScrub: useScrollScrubMock,
}));

describe("HeroVideo", () => {
  beforeEach(() => {
    usePrefersReducedMotionMock.mockReturnValue(false);
    useScrollScrubMock.mockReturnValue({ isSettled: false });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the headline, subtext and CTAs passed in", () => {
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

  it("never autoplays the video — playback is entirely scroll-driven", () => {
    const playSpy = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockResolvedValue(undefined);

    render(<HeroVideo headline="Headline" subtext="Subtext" />);

    expect(playSpy).not.toHaveBeenCalled();
  });

  it("enables scroll-scrubbing when motion is not reduced", () => {
    render(<HeroVideo headline="Headline" subtext="Subtext" />);

    expect(useScrollScrubMock).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: true }),
    );
  });

  it("disables scroll-scrubbing when the user prefers reduced motion", () => {
    usePrefersReducedMotionMock.mockReturnValue(true);

    render(<HeroVideo headline="Headline" subtext="Subtext" />);

    expect(useScrollScrubMock).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
    );
  });

  it("floats the video while scrubbing has not reached the last frame", () => {
    useScrollScrubMock.mockReturnValue({ isSettled: false });

    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    expect(container.querySelector("video")).toHaveClass("animate-float-slow");
  });

  it("stops floating once scrubbing has settled on the last frame", () => {
    useScrollScrubMock.mockReturnValue({ isSettled: true });

    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    expect(container.querySelector("video")).not.toHaveClass(
      "animate-float-slow",
    );
  });

  it("never floats when the user prefers reduced motion, even mid-scrub", () => {
    usePrefersReducedMotionMock.mockReturnValue(true);
    useScrollScrubMock.mockReturnValue({ isSettled: false });

    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    expect(container.querySelector("video")).not.toHaveClass(
      "animate-float-slow",
    );
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
});
