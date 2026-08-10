import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProjectsReveal from "./ProjectsReveal";

const { useSectionRevealMock } = vi.hoisted(() => ({
  useSectionRevealMock: vi.fn(),
}));

vi.mock("@/lib/hooks/useSectionReveal", () => ({
  useSectionReveal: useSectionRevealMock,
}));

const sampleProjects = [
  { id: "1", slug: "project-a", title: "Project A", featured: true },
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

describe("ProjectsReveal", () => {
  it("renders every project", () => {
    render(<ProjectsReveal projects={sampleProjects} hasError={false} />);

    expect(screen.getByText("Project A")).toBeInTheDocument();
    expect(screen.getByText("Destacado")).toBeInTheDocument();
  });

  it("shows an error state instead of the grid when the fetch failed", () => {
    render(<ProjectsReveal projects={[]} hasError />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("staggers the title with the entrance delay", () => {
    render(<ProjectsReveal projects={sampleProjects} hasError={false} />);

    expect(screen.getByRole("heading", { name: "Proyectos" })).toHaveStyle({
      animationDelay: "0ms",
    });
  });
});
