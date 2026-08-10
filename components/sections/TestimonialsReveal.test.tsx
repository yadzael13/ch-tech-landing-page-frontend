import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TestimonialsReveal from "./TestimonialsReveal";

const { useSectionRevealMock } = vi.hoisted(() => ({
  useSectionRevealMock: vi.fn(),
}));

vi.mock("@/lib/hooks/useSectionReveal", () => ({
  useSectionReveal: useSectionRevealMock,
}));

const sampleTestimonials = [
  {
    id: "1",
    author_name: "Jane Doe",
    author_role: "CTO",
    client_id: null,
    project_id: null,
    content: "Great work.",
    rating: null,
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

describe("TestimonialsReveal", () => {
  it("renders every testimonial", () => {
    render(
      <TestimonialsReveal testimonials={sampleTestimonials} hasError={false} />,
    );

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText(/Great work\./)).toBeInTheDocument();
  });

  it("shows an error state instead of the grid when the fetch failed", () => {
    render(<TestimonialsReveal testimonials={[]} hasError />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("staggers the title with the entrance delay", () => {
    render(
      <TestimonialsReveal testimonials={sampleTestimonials} hasError={false} />,
    );

    expect(screen.getByRole("heading", { name: "Testimonios" })).toHaveStyle({
      animationDelay: "0ms",
    });
  });
});
