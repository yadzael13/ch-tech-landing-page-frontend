import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { about } from "@/lib/content/site";
import AboutReveal from "./AboutReveal";

const { useSectionRevealMock } = vi.hoisted(() => ({
  useSectionRevealMock: vi.fn(),
}));

vi.mock("@/lib/hooks/useSectionReveal", () => ({
  useSectionReveal: useSectionRevealMock,
}));

function setEntranceStagger() {
  useSectionRevealMock.mockReturnValue({
    ref: vi.fn(),
    isVisible: true,
    blockProps: (index: number, className?: string) => ({
      className: ["animate-fade-in-up-slow", className]
        .filter(Boolean)
        .join(" "),
      style: { animationDelay: `${index * 150}ms` },
    }),
  });
}

function setExitStagger() {
  useSectionRevealMock.mockReturnValue({
    ref: vi.fn(),
    isVisible: false,
    blockProps: (index: number, className?: string) => ({
      className: ["animate-fade-out-down-slow", className]
        .filter(Boolean)
        .join(" "),
      style: { animationDelay: `${index * 150}ms` },
    }),
  });
}

describe("AboutReveal", () => {
  beforeEach(() => {
    setEntranceStagger();
  });

  it("renders the title, intro and every differentiator point", () => {
    render(<AboutReveal intro="Our vision" />);

    expect(
      screen.getByRole("heading", { name: about.title }),
    ).toBeInTheDocument();
    expect(screen.getByText("Our vision")).toBeInTheDocument();
    for (const point of about.points) {
      expect(screen.getByText(point.title)).toBeInTheDocument();
    }
  });

  it("staggers title, intro and the card grid in on entrance", () => {
    setEntranceStagger();
    render(<AboutReveal intro="Our vision" />);

    const heading = screen.getByRole("heading", { name: about.title });
    const intro = screen.getByText("Our vision");
    const cardGrid = screen.getByRole("list");

    expect(heading).toHaveClass("animate-fade-in-up-slow");
    expect(heading).toHaveStyle({ animationDelay: "0ms" });

    expect(intro).toHaveClass("animate-fade-in-up-slow");
    expect(intro).toHaveStyle({ animationDelay: "150ms" });

    expect(cardGrid).toHaveClass("animate-fade-in-up-slow");
    expect(cardGrid).toHaveStyle({ animationDelay: "300ms" });
  });

  it("staggers title, intro and the card grid out the same way on exit", () => {
    setExitStagger();
    render(<AboutReveal intro="Our vision" />);

    const heading = screen.getByRole("heading", { name: about.title });
    const intro = screen.getByText("Our vision");
    const cardGrid = screen.getByRole("list");

    expect(heading).toHaveClass("animate-fade-out-down-slow");
    expect(heading).toHaveStyle({ animationDelay: "0ms" });

    expect(intro).toHaveClass("animate-fade-out-down-slow");
    expect(intro).toHaveStyle({ animationDelay: "150ms" });

    expect(cardGrid).toHaveClass("animate-fade-out-down-slow");
    expect(cardGrid).toHaveStyle({ animationDelay: "300ms" });
  });
});
