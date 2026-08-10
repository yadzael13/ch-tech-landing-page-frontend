import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TeamReveal from "./TeamReveal";

const { useSectionRevealMock } = vi.hoisted(() => ({
  useSectionRevealMock: vi.fn(),
}));

vi.mock("@/lib/hooks/useSectionReveal", () => ({
  useSectionReveal: useSectionRevealMock,
}));

const sampleMembers = [
  {
    id: "1",
    user_id: null,
    name: "Alex",
    role: "Engineer",
    bio: null,
    photo: null,
    linkedin_url: null,
    github_url: null,
    display_order: 0,
    active: true,
  },
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

describe("TeamReveal", () => {
  it("renders every member", () => {
    render(<TeamReveal members={sampleMembers} hasError={false} />);

    expect(screen.getByText("Alex")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
  });

  it("shows an error state instead of the grid when the fetch failed", () => {
    render(<TeamReveal members={[]} hasError />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("staggers the title with the entrance delay", () => {
    render(<TeamReveal members={sampleMembers} hasError={false} />);

    expect(screen.getByRole("heading", { name: "Equipo" })).toHaveStyle({
      animationDelay: "0ms",
    });
  });
});
