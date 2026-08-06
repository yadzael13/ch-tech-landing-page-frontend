import { http, HttpResponse } from "msw";
import { describe, expect, it, vi } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import { apiFetch, ApiError } from "./client";

describe("apiFetch", () => {
  it("returns the parsed body on success", async () => {
    server.use(
      http.get(`${API_URL}/ping`, () =>
        HttpResponse.json({ success: true, data: { ok: true }, message: null }),
      ),
    );

    const body = await apiFetch<{ success: true; data: { ok: boolean } }>(
      "/ping",
    );
    expect(body.data.ok).toBe(true);
  });

  it("throws ApiError with the code/message/status from the error envelope", async () => {
    server.use(
      http.get(`${API_URL}/missing`, () =>
        HttpResponse.json(
          {
            success: false,
            error: { code: "RESOURCE_NOT_FOUND", message: "Not found" },
          },
          { status: 404 },
        ),
      ),
    );

    await expect(apiFetch("/missing")).rejects.toMatchObject({
      code: "RESOURCE_NOT_FOUND",
      message: "Not found",
      status: 404,
    });
    await expect(apiFetch("/missing")).rejects.toBeInstanceOf(ApiError);
  });

  it("requests ISR revalidation instead of an indefinite static cache", async () => {
    // Without this, Next statically freezes any page that calls apiFetch at
    // build time — admin edits (Company, Team, Testimonials, ...) would
    // never reach the public site without a redeploy (TASK-053).
    server.use(
      http.get(`${API_URL}/ping`, () =>
        HttpResponse.json({ success: true, data: { ok: true }, message: null }),
      ),
    );
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await apiFetch("/ping");

    expect(fetchSpy).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ next: { revalidate: 60 } }),
    );
    fetchSpy.mockRestore();
  });
});
