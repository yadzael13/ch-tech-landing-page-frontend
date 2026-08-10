import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DashboardLoading from "./loading";

describe("DashboardLoading", () => {
  it("shows a status spinner", () => {
    render(<DashboardLoading />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
