import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { hero } from "@/lib/content/site";
import HeroVideo from "./HeroVideo";

const { usePrefersReducedMotionMock, useVideoBoomerangMock } = vi.hoisted(
  () => ({
    usePrefersReducedMotionMock: vi.fn(() => false),
    useVideoBoomerangMock: vi.fn(),
  }),
);

vi.mock("@/lib/hooks/usePrefersReducedMotion", () => ({
  usePrefersReducedMotion: usePrefersReducedMotionMock,
}));

vi.mock("@/lib/hooks/useVideoBoomerang", () => ({
  useVideoBoomerang: useVideoBoomerangMock,
}));

describe("HeroVideo", () => {
  beforeEach(() => {
    usePrefersReducedMotionMock.mockReturnValue(false);
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

  it("enables the boomerang loop when motion is not reduced", () => {
    render(<HeroVideo headline="Headline" subtext="Subtext" />);

    expect(useVideoBoomerangMock).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: true }),
    );
  });

  it("disables the boomerang loop when the user prefers reduced motion", () => {
    usePrefersReducedMotionMock.mockReturnValue(true);

    render(<HeroVideo headline="Headline" subtext="Subtext" />);

    expect(useVideoBoomerangMock).toHaveBeenCalledWith(
      expect.objectContaining({ enabled: false }),
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

  it("gives the info panel a surface background, separate from the page background", () => {
    const { container } = render(
      <HeroVideo headline="Headline" subtext="Subtext" />,
    );

    const panel = container.querySelector(".bg-surface");
    expect(panel).toBeInTheDocument();
    expect(panel).toContainElement(screen.getByText("Subtext"));
  });
});
