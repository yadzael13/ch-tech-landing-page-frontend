import { SuccessEnvelope } from "./client";
import {
  ArticleDetail,
  ArticleWrite,
  CaseStudyItem,
  CaseStudyWrite,
  ClientItem,
  ClientWrite,
  CompanyItem,
  CompanyWrite,
  PartnerItem,
  PartnerWrite,
  ProductItem,
  ProductWrite,
  ProjectDetail,
  ProjectWrite,
  ServiceItem,
  ServiceWrite,
  TeamMemberItem,
  TeamMemberWrite,
  TechnologyItem,
  TechnologyWrite,
  TestimonialItem,
  TestimonialWrite,
} from "./types";

/** The shape of AuthContext's authedFetch — kept as a plain type here so
 * this module doesn't depend on the client-only auth context. */
export type AuthedFetch = <T>(path: string, init?: RequestInit) => Promise<T>;

export async function getAdminProjects(
  authedFetch: AuthedFetch,
): Promise<ProjectDetail[]> {
  // The full ProjectDetail shape, not the public ProjectListItem — the
  // management table needs status/visibility, which the public list omits
  // (backend/app/api/v1/projects.py::list_admin_projects).
  const body =
    await authedFetch<SuccessEnvelope<ProjectDetail[]>>("/admin/projects");
  return body.data;
}

export async function getAdminProject(
  authedFetch: AuthedFetch,
  id: string,
): Promise<ProjectDetail> {
  const body = await authedFetch<SuccessEnvelope<ProjectDetail>>(
    `/admin/projects/${id}`,
  );
  return body.data;
}

export async function createProject(
  authedFetch: AuthedFetch,
  payload: ProjectWrite,
): Promise<ProjectDetail> {
  const body = await authedFetch<SuccessEnvelope<ProjectDetail>>(
    "/admin/projects",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function updateProject(
  authedFetch: AuthedFetch,
  id: string,
  payload: ProjectWrite,
): Promise<ProjectDetail> {
  const body = await authedFetch<SuccessEnvelope<ProjectDetail>>(
    `/admin/projects/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function deleteProject(
  authedFetch: AuthedFetch,
  id: string,
): Promise<void> {
  await authedFetch<void>(`/admin/projects/${id}`, { method: "DELETE" });
}

export async function getAdminServices(
  authedFetch: AuthedFetch,
): Promise<ServiceItem[]> {
  const body =
    await authedFetch<SuccessEnvelope<ServiceItem[]>>("/admin/services");
  return body.data;
}

export async function getAdminService(
  authedFetch: AuthedFetch,
  id: string,
): Promise<ServiceItem> {
  const body = await authedFetch<SuccessEnvelope<ServiceItem>>(
    `/admin/services/${id}`,
  );
  return body.data;
}

export async function createService(
  authedFetch: AuthedFetch,
  payload: ServiceWrite,
): Promise<ServiceItem> {
  const body = await authedFetch<SuccessEnvelope<ServiceItem>>(
    "/admin/services",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function updateService(
  authedFetch: AuthedFetch,
  id: string,
  payload: ServiceWrite,
): Promise<ServiceItem> {
  const body = await authedFetch<SuccessEnvelope<ServiceItem>>(
    `/admin/services/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function deleteService(
  authedFetch: AuthedFetch,
  id: string,
): Promise<void> {
  await authedFetch<void>(`/admin/services/${id}`, { method: "DELETE" });
}

// Technology has no admin-only reads (see lib/api/content.ts::getTechnology)
// — the public endpoints already return everything, since there's no
// visibility/active concept on this resource. Only mutations need auth.

export async function createTechnology(
  authedFetch: AuthedFetch,
  payload: TechnologyWrite,
): Promise<TechnologyItem> {
  const body = await authedFetch<SuccessEnvelope<TechnologyItem>>(
    "/admin/technologies",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function updateTechnology(
  authedFetch: AuthedFetch,
  id: string,
  payload: TechnologyWrite,
): Promise<TechnologyItem> {
  const body = await authedFetch<SuccessEnvelope<TechnologyItem>>(
    `/admin/technologies/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function deleteTechnology(
  authedFetch: AuthedFetch,
  id: string,
): Promise<void> {
  await authedFetch<void>(`/admin/technologies/${id}`, { method: "DELETE" });
}

export async function getAdminArticles(
  authedFetch: AuthedFetch,
): Promise<ArticleDetail[]> {
  // The full ArticleDetail shape, not the public ArticleListItem — the
  // management table needs the explicit `published` flag, which the public
  // list omits (backend/app/api/v1/articles.py::list_admin_articles).
  const body =
    await authedFetch<SuccessEnvelope<ArticleDetail[]>>("/admin/articles");
  return body.data;
}

export async function getAdminArticle(
  authedFetch: AuthedFetch,
  id: string,
): Promise<ArticleDetail> {
  const body = await authedFetch<SuccessEnvelope<ArticleDetail>>(
    `/admin/articles/${id}`,
  );
  return body.data;
}

export async function createArticle(
  authedFetch: AuthedFetch,
  payload: ArticleWrite,
): Promise<ArticleDetail> {
  const body = await authedFetch<SuccessEnvelope<ArticleDetail>>(
    "/admin/articles",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function updateArticle(
  authedFetch: AuthedFetch,
  id: string,
  payload: ArticleWrite,
): Promise<ArticleDetail> {
  const body = await authedFetch<SuccessEnvelope<ArticleDetail>>(
    `/admin/articles/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function deleteArticle(
  authedFetch: AuthedFetch,
  id: string,
): Promise<void> {
  await authedFetch<void>(`/admin/articles/${id}`, { method: "DELETE" });
}

export async function getAdminCaseStudies(
  authedFetch: AuthedFetch,
): Promise<CaseStudyItem[]> {
  const body = await authedFetch<SuccessEnvelope<CaseStudyItem[]>>(
    "/admin/case-studies",
  );
  return body.data;
}

export async function getAdminCaseStudy(
  authedFetch: AuthedFetch,
  id: string,
): Promise<CaseStudyItem> {
  const body = await authedFetch<SuccessEnvelope<CaseStudyItem>>(
    `/admin/case-studies/${id}`,
  );
  return body.data;
}

export async function createCaseStudy(
  authedFetch: AuthedFetch,
  payload: CaseStudyWrite,
): Promise<CaseStudyItem> {
  const body = await authedFetch<SuccessEnvelope<CaseStudyItem>>(
    "/admin/case-studies",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function updateCaseStudy(
  authedFetch: AuthedFetch,
  id: string,
  payload: CaseStudyWrite,
): Promise<CaseStudyItem> {
  const body = await authedFetch<SuccessEnvelope<CaseStudyItem>>(
    `/admin/case-studies/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function deleteCaseStudy(
  authedFetch: AuthedFetch,
  id: string,
): Promise<void> {
  await authedFetch<void>(`/admin/case-studies/${id}`, { method: "DELETE" });
}

export async function updateCompany(
  authedFetch: AuthedFetch,
  payload: CompanyWrite,
): Promise<CompanyItem> {
  const body = await authedFetch<SuccessEnvelope<CompanyItem>>(
    "/admin/company",
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function getAdminTeamMembers(
  authedFetch: AuthedFetch,
): Promise<TeamMemberItem[]> {
  // Unlike GET /team, this omits the active=true filter — the management
  // table needs to see inactive members too (backend/app/api/v1/team_members.py).
  const body =
    await authedFetch<SuccessEnvelope<TeamMemberItem[]>>("/admin/team");
  return body.data;
}

export async function getAdminTeamMember(
  authedFetch: AuthedFetch,
  id: string,
): Promise<TeamMemberItem> {
  const body = await authedFetch<SuccessEnvelope<TeamMemberItem>>(
    `/admin/team/${id}`,
  );
  return body.data;
}

export async function createTeamMember(
  authedFetch: AuthedFetch,
  payload: TeamMemberWrite,
): Promise<TeamMemberItem> {
  const body = await authedFetch<SuccessEnvelope<TeamMemberItem>>(
    "/admin/team",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function updateTeamMember(
  authedFetch: AuthedFetch,
  id: string,
  payload: TeamMemberWrite,
): Promise<TeamMemberItem> {
  const body = await authedFetch<SuccessEnvelope<TeamMemberItem>>(
    `/admin/team/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function deleteTeamMember(
  authedFetch: AuthedFetch,
  id: string,
): Promise<void> {
  await authedFetch<void>(`/admin/team/${id}`, { method: "DELETE" });
}

export async function createClient(
  authedFetch: AuthedFetch,
  payload: ClientWrite,
): Promise<ClientItem> {
  const body = await authedFetch<SuccessEnvelope<ClientItem>>(
    "/admin/clients",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function updateClient(
  authedFetch: AuthedFetch,
  id: string,
  payload: ClientWrite,
): Promise<ClientItem> {
  const body = await authedFetch<SuccessEnvelope<ClientItem>>(
    `/admin/clients/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function deleteClient(
  authedFetch: AuthedFetch,
  id: string,
): Promise<void> {
  await authedFetch<void>(`/admin/clients/${id}`, { method: "DELETE" });
}

export async function createTestimonial(
  authedFetch: AuthedFetch,
  payload: TestimonialWrite,
): Promise<TestimonialItem> {
  const body = await authedFetch<SuccessEnvelope<TestimonialItem>>(
    "/admin/testimonials",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function updateTestimonial(
  authedFetch: AuthedFetch,
  id: string,
  payload: TestimonialWrite,
): Promise<TestimonialItem> {
  const body = await authedFetch<SuccessEnvelope<TestimonialItem>>(
    `/admin/testimonials/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function deleteTestimonial(
  authedFetch: AuthedFetch,
  id: string,
): Promise<void> {
  await authedFetch<void>(`/admin/testimonials/${id}`, { method: "DELETE" });
}

export async function createProduct(
  authedFetch: AuthedFetch,
  payload: ProductWrite,
): Promise<ProductItem> {
  const body = await authedFetch<SuccessEnvelope<ProductItem>>(
    "/admin/products",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function updateProduct(
  authedFetch: AuthedFetch,
  id: string,
  payload: ProductWrite,
): Promise<ProductItem> {
  const body = await authedFetch<SuccessEnvelope<ProductItem>>(
    `/admin/products/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function deleteProduct(
  authedFetch: AuthedFetch,
  id: string,
): Promise<void> {
  await authedFetch<void>(`/admin/products/${id}`, { method: "DELETE" });
}

export async function createPartner(
  authedFetch: AuthedFetch,
  payload: PartnerWrite,
): Promise<PartnerItem> {
  const body = await authedFetch<SuccessEnvelope<PartnerItem>>(
    "/admin/partners",
    { method: "POST", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function updatePartner(
  authedFetch: AuthedFetch,
  id: string,
  payload: PartnerWrite,
): Promise<PartnerItem> {
  const body = await authedFetch<SuccessEnvelope<PartnerItem>>(
    `/admin/partners/${id}`,
    { method: "PUT", body: JSON.stringify(payload) },
  );
  return body.data;
}

export async function deletePartner(
  authedFetch: AuthedFetch,
  id: string,
): Promise<void> {
  await authedFetch<void>(`/admin/partners/${id}`, { method: "DELETE" });
}
