import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { navLinks } from "@/lib/content/site";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders every nav link", () => {
    render(<Navbar />);

    for (const link of navLinks) {
      expect(
        screen.getAllByRole("link", { name: link.label }).length,
      ).toBeGreaterThan(0);
    }
  });

  it("toggles the mobile menu when the button is clicked", () => {
    render(<Navbar />);

    expect(
      screen.queryByRole("button", { name: "Cerrar" }),
    ).not.toBeInTheDocument();
    const toggle = screen.getByRole("button", { name: "Menú" });

    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(screen.getByRole("button", { name: "Menú" })).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the toggle button", () => {
    render(<Navbar />);

    const toggle = screen.getByRole("button", { name: "Menú" });
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.getByRole("button", { name: "Menú" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Menú" })).toHaveFocus();
  });
});
