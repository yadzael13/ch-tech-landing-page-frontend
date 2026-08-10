import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { about } from "@/lib/content/site";
import AboutReveal from "./AboutReveal";

const { useScrollRevealMock } = vi.hoisted(() => ({
  useScrollRevealMock: vi.fn(),
}));

vi.mock("@/lib/hooks/useScrollReveal", () => ({
  useScrollReveal: useScrollRevealMock,
}));

function setVisible(isVisible: boolean) {
  useScrollRevealMock.mockReturnValue({ ref: vi.fn(), isVisible });
}

describe("AboutReveal", () => {
  beforeEach(() => {
    setVisible(true);
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
    setVisible(true);
    render(<AboutReveal intro="Our vision" />);

    const heading = screen.getByRole("heading", { name: about.title });
    const intro = screen.getByText("Our vision");
    const cardGrid = screen.getByRole("list");

    expect(heading).toHaveClass("animate-fade-in-up-slow");
    expect(heading).not.toHaveClass("opacity-0");
    expect(heading).toHaveStyle({ animationDelay: "0ms" });

    expect(intro).toHaveClass("animate-fade-in-up-slow");
    expect(intro).toHaveStyle({ animationDelay: "150ms" });

    expect(cardGrid).toHaveClass("animate-fade-in-up-slow");
    expect(cardGrid).toHaveStyle({ animationDelay: "300ms" });
  });

  it("fades every block out together, with no stagger, on exit", () => {
    setVisible(false);
    render(<AboutReveal intro="Our vision" />);

    const heading = screen.getByRole("heading", { name: about.title });
    const intro = screen.getByText("Our vision");
    const cardGrid = screen.getByRole("list");

    for (const block of [heading, intro, cardGrid]) {
      expect(block).toHaveClass("opacity-0");
      expect(block).not.toHaveClass("animate-fade-in-up-slow");
      expect(block.style.animationDelay).toBe("");
    }
  });
});
