import { getTestimonials } from "@/lib/api/content";
import TestimonialsReveal from "./TestimonialsReveal";

export default async function Testimonials() {
  let testimonials: Awaited<ReturnType<typeof getTestimonials>> = [];
  let hasError = false;

  try {
    testimonials = (await getTestimonials()).filter((t) => t.featured);
  } catch {
    hasError = true;
  }

  return <TestimonialsReveal testimonials={testimonials} hasError={hasError} />;
}
