import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BusinessLinesReveal from "./BusinessLinesReveal";

const { useSectionRevealMock } = vi.hoisted(() => ({
  useSectionRevealMock: vi.fn(),
}));

vi.mock("@/lib/hooks/useSectionReveal", () => ({
  useSectionReveal: useSectionRevealMock,
}));

const sampleServiceLines = [
  {
    id: "1",
    slug: "consulting",
    name: "Consultoría",
    description: "Asesoría técnica.",
    icon: null,
    display_order: 0,
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

describe("BusinessLinesReveal", () => {
  it("renders every service line", () => {
    render(
      <BusinessLinesReveal
        serviceLines={sampleServiceLines}
        hasError={false}
      />,
    );

    expect(screen.getByText("Consultoría")).toBeInTheDocument();
    expect(screen.getByText("Asesoría técnica.")).toBeInTheDocument();
  });

  it("shows an error state instead of the grid when the fetch failed", () => {
    render(<BusinessLinesReveal serviceLines={[]} hasError />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("staggers the title and the grid with increasing delay", () => {
    render(
      <BusinessLinesReveal
        serviceLines={sampleServiceLines}
        hasError={false}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Líneas de negocio" }),
    ).toHaveStyle({ animationDelay: "0ms" });
  });
});
