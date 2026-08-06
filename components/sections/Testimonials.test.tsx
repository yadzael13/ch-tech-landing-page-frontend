import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { API_URL, server } from "@/test/msw-server";
import Testimonials from "./Testimonials";

const featuredTestimonial = {
  id: "1",
  author_name: "Jane Doe",
  author_role: "CTO, Acme Corp",
  client_id: null,
  project_id: null,
  content: "El equipo de CH-TECH entregó justo lo que necesitábamos.",
  rating: 5,
  featured: true,
};

const unfeaturedTestimonial = {
  ...featuredTestimonial,
  id: "2",
  author_name: "John Smith",
  featured: false,
};

describe("Testimonials", () => {
  it("renders only featured testimonials", async () => {
    server.use(
      http.get(`${API_URL}/testimonials`, () =>
        HttpResponse.json({
          success: true,
          data: [featuredTestimonial, unfeaturedTestimonial],
          message: null,
        }),
      ),
    );

    render(await Testimonials());

    expect(screen.getByText(featuredTestimonial.author_name)).toBeInTheDocument();
    expect(
      screen.queryByText(unfeaturedTestimonial.author_name),
    ).not.toBeInTheDocument();
  });

  it("shows an empty state when there are no featured testimonials", async () => {
    server.use(
      http.get(`${API_URL}/testimonials`, () =>
        HttpResponse.json({
          success: true,
          data: [unfeaturedTestimonial],
          message: null,
        }),
      ),
    );

    render(await Testimonials());

    expect(
      screen.getByText("Aún no hay testimonios publicados."),
    ).toBeInTheDocument();
  });

  it("shows an error state when the API request fails", async () => {
    server.use(
      http.get(`${API_URL}/testimonials`, () =>
        HttpResponse.json(
          {
            success: false,
            error: { code: "INTERNAL_SERVER_ERROR", message: "boom" },
          },
          { status: 500 },
        ),
      ),
    );

    render(await Testimonials());

    expect(
      screen.getByText(
        "No fue posible cargar los testimonios en este momento.",
      ),
    ).toBeInTheDocument();
  });
});
