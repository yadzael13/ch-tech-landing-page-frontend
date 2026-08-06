/** Mirrors backend/app/schemas/project.py::ProjectListItem exactly —
 * GET /projects does not return description/image/technologies. */
export interface ProjectListItem {
  id: string;
  slug: string;
  title: string;
  featured: boolean;
}

/** Mirrors backend/app/schemas/technology.py::TechnologyItem. */
export interface TechnologyItem {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
  official_url: string | null;
}

/** Mirrors backend/app/schemas/technology.py::TechnologyWrite. */
export interface TechnologyWrite {
  name: string;
  category?: string | null;
  icon?: string | null;
  official_url?: string | null;
}

/** Mirrors backend/app/schemas/service.py::ServiceItem. */
export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  featured: boolean;
  active: boolean;
}

/** Mirrors backend/app/schemas/contact.py::ContactCreate. */
export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  subject?: string;
  message: string;
}

/** Mirrors backend/app/schemas/contact.py::ContactReceived. */
export interface ContactReceived {
  message: string;
}

/** Mirrors backend/app/schemas/auth.py::LoginRequest. */
export interface LoginPayload {
  email: string;
  password: string;
}

/** Mirrors backend/app/schemas/auth.py::TokenResponse. */
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

/** Mirrors backend/app/schemas/project.py::TechnologySummary. */
export interface TechnologySummary {
  id: string;
  name: string;
  category: string | null;
}

/** Mirrors backend/app/schemas/project.py::ProjectDetail. */
export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  full_description: string | null;
  repository_url: string | null;
  live_demo_url: string | null;
  cover_image: string | null;
  status: string;
  visibility: string;
  featured: boolean;
  started_at: string | null;
  finished_at: string | null;
  technologies: TechnologySummary[];
}

/** Mirrors backend/app/schemas/service.py::ServiceWrite. */
export interface ServiceWrite {
  slug: string;
  title: string;
  description?: string | null;
  featured?: boolean;
  active?: boolean;
}

/** Mirrors backend/app/schemas/project.py::ProjectWrite. */
export interface ProjectWrite {
  slug: string;
  title: string;
  short_description?: string | null;
  full_description?: string | null;
  repository_url?: string | null;
  live_demo_url?: string | null;
  cover_image?: string | null;
  status?: string;
  visibility?: string;
  featured?: boolean;
  started_at?: string | null;
  finished_at?: string | null;
  technology_ids?: string[];
}

/** Mirrors backend/app/schemas/article.py::ArticleDetail. */
export interface ArticleDetail {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  cover_image: string | null;
  reading_time: number | null;
  published: boolean;
  published_at: string | null;
  author_id: string;
  technologies: TechnologySummary[];
}

/** Mirrors backend/app/schemas/article.py::ArticleWrite. */
export interface ArticleWrite {
  slug: string;
  title: string;
  summary?: string | null;
  content: string;
  cover_image?: string | null;
  reading_time?: number | null;
  published?: boolean;
  published_at?: string | null;
  technology_ids?: string[];
}

/** Mirrors backend/app/schemas/case_study.py::CaseStudyItem. */
export interface CaseStudyItem {
  id: string;
  project_id: string;
  challenge: string | null;
  solution: string | null;
  architecture: string | null;
  lessons_learned: string | null;
  metrics: Record<string, unknown> | null;
}

/** Mirrors backend/app/schemas/case_study.py::CaseStudyWrite. */
export interface CaseStudyWrite {
  project_id: string;
  challenge?: string | null;
  solution?: string | null;
  architecture?: string | null;
  lessons_learned?: string | null;
  metrics?: Record<string, unknown> | null;
}

/** Mirrors backend/app/schemas/company.py::CompanyItem. Company is a
 * singleton (docs/API.md) — no list, no id in write payloads. */
export interface CompanyItem {
  id: string;
  legal_name: string;
  display_name: string;
  tagline: string | null;
  mission: string | null;
  vision: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  social_links: Record<string, unknown> | null;
}

/** Mirrors backend/app/schemas/company.py::CompanyWrite. */
export interface CompanyWrite {
  legal_name: string;
  display_name: string;
  tagline?: string | null;
  mission?: string | null;
  vision?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  social_links?: Record<string, unknown> | null;
}

/** Mirrors backend/app/schemas/team_member.py::TeamMemberItem. */
export interface TeamMemberItem {
  id: string;
  user_id: string | null;
  name: string;
  role: string;
  bio: string | null;
  photo: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  display_order: number;
  active: boolean;
}

/** Mirrors backend/app/schemas/team_member.py::TeamMemberWrite. */
export interface TeamMemberWrite {
  user_id?: string | null;
  name: string;
  role: string;
  bio?: string | null;
  photo?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  display_order?: number;
  active?: boolean;
}

/** Mirrors backend/app/schemas/client.py::ClientItem. */
export interface ClientItem {
  id: string;
  name: string;
  logo: string | null;
  industry: string | null;
  website_url: string | null;
}

/** Mirrors backend/app/schemas/client.py::ClientWrite. */
export interface ClientWrite {
  name: string;
  logo?: string | null;
  industry?: string | null;
  website_url?: string | null;
}

/** Mirrors backend/app/schemas/testimonial.py::TestimonialItem. */
export interface TestimonialItem {
  id: string;
  author_name: string;
  author_role: string | null;
  client_id: string | null;
  project_id: string | null;
  content: string;
  rating: number | null;
  featured: boolean;
}

/** Mirrors backend/app/schemas/testimonial.py::TestimonialWrite. */
export interface TestimonialWrite {
  author_name: string;
  author_role?: string | null;
  client_id?: string | null;
  project_id?: string | null;
  content: string;
  rating?: number | null;
  featured?: boolean;
}

/** Mirrors backend/app/schemas/product.py::ProductItem. status is one of
 * ProductStatus (backend/app/domain/enums.py): WAITLIST | BETA | LIVE. */
export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  full_description: string | null;
  status: string;
  url: string | null;
  logo: string | null;
  featured: boolean;
}

/** Mirrors backend/app/schemas/product.py::ProductWrite. */
export interface ProductWrite {
  slug: string;
  name: string;
  short_description?: string | null;
  full_description?: string | null;
  status?: string;
  url?: string | null;
  logo?: string | null;
  featured?: boolean;
}

/** Mirrors backend/app/schemas/partner.py::PartnerItem. */
export interface PartnerItem {
  id: string;
  name: string;
  logo: string | null;
  partnership_type: string | null;
  website_url: string | null;
}

/** Mirrors backend/app/schemas/partner.py::PartnerWrite. */
export interface PartnerWrite {
  name: string;
  logo?: string | null;
  partnership_type?: string | null;
  website_url?: string | null;
}

/** Mirrors backend/app/schemas/service_line.py::ServiceLineItem. */
export interface ServiceLineItem {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  display_order: number;
}
