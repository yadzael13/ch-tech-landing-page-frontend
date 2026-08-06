import { describe, expect, it } from "vitest";
import { siteUrl } from "@/lib/content/site";
import robots from "./robots";

describe("robots", () => {
  it("allows crawling the public site and disallows /admin", () => {
    const result = robots();

    expect(result.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: "/admin",
    });
    expect(result.sitemap).toBe(`${siteUrl}/sitemap.xml`);
  });
});
