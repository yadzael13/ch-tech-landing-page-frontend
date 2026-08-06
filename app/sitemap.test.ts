import { describe, expect, it } from "vitest";
import { siteUrl } from "@/lib/content/site";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists the public homepage", () => {
    const result = sitemap();

    expect(result).toHaveLength(1);
    expect(result[0]!.url).toBe(siteUrl);
    expect(result[0]!.lastModified).toBeInstanceOf(Date);
  });
});
