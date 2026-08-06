import { apiFetch, SuccessEnvelope } from "./client";
import {
  ClientItem,
  CompanyItem,
  ContactPayload,
  ContactReceived,
  PartnerItem,
  ProductItem,
  ProjectListItem,
  ServiceLineItem,
  TeamMemberItem,
  TechnologyItem,
  TestimonialItem,
} from "./types";

export async function getFeaturedProjects(): Promise<ProjectListItem[]> {
  const body = await apiFetch<SuccessEnvelope<ProjectListItem[]>>(
    "/projects?featured=true&limit=6",
  );
  return body.data;
}

export async function getTechnologies(): Promise<TechnologyItem[]> {
  const body =
    await apiFetch<SuccessEnvelope<TechnologyItem[]>>("/technologies");
  return body.data;
}

export async function getTechnology(id: string): Promise<TechnologyItem> {
  // No admin-only variant needed: unlike Project/Service, Technology has no
  // visibility/active concept — the public detail endpoint already returns
  // everything, so the admin edit form can read straight from it.
  const body = await apiFetch<SuccessEnvelope<TechnologyItem>>(
    `/technologies/${id}`,
  );
  return body.data;
}

export async function submitContact(
  payload: ContactPayload,
): Promise<ContactReceived> {
  return apiFetch<ContactReceived>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCompany(): Promise<CompanyItem> {
  const body = await apiFetch<SuccessEnvelope<CompanyItem>>("/company");
  return body.data;
}

// Client/Testimonial/Product/Partner have no admin-only reads (docs/API.md
// lists only GET, POST /admin/x, PUT /admin/x/{id}, DELETE /admin/x/{id} —
// no GET /admin/x or GET /admin/x/{id}). The admin list AND edit pages read
// straight from the public endpoint, same as Technology (see getTechnology).

export async function getClients(): Promise<ClientItem[]> {
  const body = await apiFetch<SuccessEnvelope<ClientItem[]>>("/clients");
  return body.data;
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  const body =
    await apiFetch<SuccessEnvelope<TestimonialItem[]>>("/testimonials");
  return body.data;
}

export async function getProducts(): Promise<ProductItem[]> {
  const body = await apiFetch<SuccessEnvelope<ProductItem[]>>("/products");
  return body.data;
}

export async function getPartners(): Promise<PartnerItem[]> {
  const body = await apiFetch<SuccessEnvelope<PartnerItem[]>>("/partners");
  return body.data;
}

export async function getServiceLines(): Promise<ServiceLineItem[]> {
  const body =
    await apiFetch<SuccessEnvelope<ServiceLineItem[]>>("/service-lines");
  return body.data;
}

export async function getTeamMembers(): Promise<TeamMemberItem[]> {
  // Public endpoint — already filtered to active=true server-side
  // (backend/app/api/v1/team_members.py::list_team_members).
  const body = await apiFetch<SuccessEnvelope<TeamMemberItem[]>>("/team");
  return body.data;
}
