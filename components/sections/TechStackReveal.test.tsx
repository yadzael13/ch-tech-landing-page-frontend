import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TechStackReveal from "./TechStackReveal";

const { useSectionRevealMock } = vi.hoisted(() => ({
  useSectionRevealMock: vi.fn(),
}));

vi.mock("@/lib/hooks/useSectionReveal", () => ({
  useSectionReveal: useSectionRevealMock,
}));

const sampleTechnologies = [
  {
    id: "1",
    name: "TypeScript",
    category: null,
    icon: null,
    official_url: null,
  },
  { id: "2", name: "Python", category: null, icon: null, official_url: null },
];

beforeEach(() => {
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
});

describe("TechStackReveal", () => {
  it("renders every technology", () => {
    render(
      <TechStackReveal technologies={sampleTechnologies} hasError={false} />,
    );

    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Python")).toBeInTheDocument();
  });

  it("shows an error state instead of the list when the fetch failed", () => {
    render(<TechStackReveal technologies={[]} hasError />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("shows an empty state when there are no technologies", () => {
    render(<TechStackReveal technologies={[]} hasError={false} />);

    expect(screen.getByText(/aún no hay tecnologías/i)).toBeInTheDocument();
  });

  it("staggers the title and the list with increasing delay", () => {
    render(
      <TechStackReveal technologies={sampleTechnologies} hasError={false} />,
    );

    expect(screen.getByRole("heading", { name: "Tecnologías" })).toHaveStyle({
      animationDelay: "0ms",
    });
    expect(screen.getByRole("list")).toHaveStyle({ animationDelay: "150ms" });
  });
});
