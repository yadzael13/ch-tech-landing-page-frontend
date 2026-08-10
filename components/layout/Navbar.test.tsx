import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { navLinks } from "@/lib/content/site";
import Navbar from "./Navbar";

afterEach(() => {
  vi.useRealTimers();
});

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

  it("plays an exit transition before the mobile menu unmounts", () => {
    vi.useFakeTimers();
    render(<Navbar />);

    fireEvent.click(screen.getByRole("button", { name: "Menú" }));
    const menu = document.getElementById("mobile-menu");
    expect(menu).toHaveClass("animate-scale-in");

    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
    // Still in the DOM immediately after closing — exit animation plays first.
    expect(document.getElementById("mobile-menu")).toHaveClass(
      "transition-opacity",
    );

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(document.getElementById("mobile-menu")).not.toBeInTheDocument();
  });
});
