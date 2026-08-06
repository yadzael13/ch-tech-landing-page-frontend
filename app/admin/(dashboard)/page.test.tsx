import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminDashboardPage from "./page";

describe("AdminDashboardPage", () => {
  it("renders a link to Projects", () => {
    render(<AdminDashboardPage />);

    expect(screen.getByRole("link", { name: /Projects/ })).toHaveAttribute(
      "href",
      "/admin/projects",
    );
  });
});
