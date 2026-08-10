import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import NotFound from "./not-found";

describe("NotFound", () => {
  it("shows a link back to the home page", () => {
    render(<NotFound />);

    expect(screen.getByText("404")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: "Volver al inicio" });
    expect(link).toHaveAttribute("href", "/");
  });
});
