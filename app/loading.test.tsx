import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Loading from "./loading";

describe("Loading", () => {
  it("shows a status spinner", () => {
    render(<Loading />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
