import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("is hidden from assistive tech (purely decorative)", () => {
    const { container } = render(<Skeleton />);

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("applies the shimmer animation class", () => {
    const { container } = render(<Skeleton />);

    expect(container.firstChild).toHaveClass("animate-shimmer");
  });

  it("merges a custom className for sizing", () => {
    const { container } = render(<Skeleton className="h-4 w-32" />);

    expect(container.firstChild).toHaveClass("h-4", "w-32");
  });
});
