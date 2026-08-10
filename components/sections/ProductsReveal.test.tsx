import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductsReveal from "./ProductsReveal";

const { useSectionRevealMock } = vi.hoisted(() => ({
  useSectionRevealMock: vi.fn(),
}));

vi.mock("@/lib/hooks/useSectionReveal", () => ({
  useSectionReveal: useSectionRevealMock,
}));

const sampleProducts = [
  {
    id: "1",
    slug: "chtech-suite",
    name: "CH-TECH Suite",
    short_description: "Our flagship product.",
    full_description: null,
    status: "LIVE",
    url: null,
    logo: null,
    featured: true,
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

describe("ProductsReveal", () => {
  it("renders every product", () => {
    render(<ProductsReveal products={sampleProducts} hasError={false} />);

    expect(screen.getByText("CH-TECH Suite")).toBeInTheDocument();
    expect(screen.getByText("Disponible")).toBeInTheDocument();
  });

  it("shows an error state instead of the grid when the fetch failed", () => {
    render(<ProductsReveal products={[]} hasError />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("shows the waitlist CTA when there are no products yet", () => {
    render(<ProductsReveal products={[]} hasError={false} />);

    expect(
      screen.getByRole("link", { name: /lista de espera/i }),
    ).toBeInTheDocument();
  });

  it("staggers the title with the entrance delay", () => {
    render(<ProductsReveal products={sampleProducts} hasError={false} />);

    expect(screen.getByRole("heading", { name: "Productos SaaS" })).toHaveStyle(
      { animationDelay: "0ms" },
    );
  });
});
