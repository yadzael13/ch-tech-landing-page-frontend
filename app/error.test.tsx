import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "./error";

describe("Error", () => {
  it("shows a retry button that calls reset", () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error("boom")} reset={reset} />);

    fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));

    expect(reset).toHaveBeenCalledOnce();
  });
});
