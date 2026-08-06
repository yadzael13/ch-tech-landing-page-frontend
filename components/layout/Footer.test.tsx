import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { footer, siteMeta } from "@/lib/content/site";
import Footer from "./Footer";

describe("Footer", () => {
  it("renders the contact email and social links", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: siteMeta.email })).toHaveAttribute(
      "href",
      `mailto:${siteMeta.email}`,
    );

    for (const social of footer.socials) {
      expect(screen.getByRole("link", { name: social.label })).toHaveAttribute(
        "href",
        social.href,
      );
    }
  });

  it("renders the current year in the copyright line", () => {
    render(<Footer />);

    expect(
      screen.getByText(new RegExp(String(new Date().getFullYear()))),
    ).toBeInTheDocument();
  });
});
