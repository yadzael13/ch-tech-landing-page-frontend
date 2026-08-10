import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ClientsReveal from "./ClientsReveal";

const { useSectionRevealMock } = vi.hoisted(() => ({
  useSectionRevealMock: vi.fn(),
}));

vi.mock("@/lib/hooks/useSectionReveal", () => ({
  useSectionReveal: useSectionRevealMock,
}));

const sampleClients = [
  {
    id: "1",
    name: "Acme",
    logo: null,
    industry: null,
    website_url: null,
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

describe("ClientsReveal", () => {
  it("renders every client", () => {
    render(<ClientsReveal clients={sampleClients} hasError={false} />);

    expect(screen.getByText("Acme")).toBeInTheDocument();
  });

  it("shows an error state instead of the list when the fetch failed", () => {
    render(<ClientsReveal clients={[]} hasError />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("staggers the title and the list with increasing delay", () => {
    render(<ClientsReveal clients={sampleClients} hasError={false} />);

    expect(screen.getByRole("list")).toHaveStyle({ animationDelay: "150ms" });
  });
});
