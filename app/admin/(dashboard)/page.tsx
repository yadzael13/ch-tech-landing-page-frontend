import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-foreground">
        Dashboard
      </h1>
      <p className="mt-2 text-muted">
        Bienvenido al panel de administración de CH-TECH.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href="/admin/projects"
          className="focus-ring flex w-56 flex-col gap-1 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
        >
          <span className="font-medium text-foreground">Projects</span>
          <span className="text-sm text-muted">
            Gestionar proyectos publicados
          </span>
        </Link>
        <Link
          href="/admin/services"
          className="focus-ring flex w-56 flex-col gap-1 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
        >
          <span className="font-medium text-foreground">Services</span>
          <span className="text-sm text-muted">
            Gestionar servicios ofrecidos
          </span>
        </Link>
        <Link
          href="/admin/technologies"
          className="focus-ring flex w-56 flex-col gap-1 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
        >
          <span className="font-medium text-foreground">Technologies</span>
          <span className="text-sm text-muted">
            Gestionar tecnologías del stack
          </span>
        </Link>
        <Link
          href="/admin/articles"
          className="focus-ring flex w-56 flex-col gap-1 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
        >
          <span className="font-medium text-foreground">Articles</span>
          <span className="text-sm text-muted">
            Gestionar artículos del blog
          </span>
        </Link>
        <Link
          href="/admin/case-studies"
          className="focus-ring flex w-56 flex-col gap-1 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
        >
          <span className="font-medium text-foreground">Case Studies</span>
          <span className="text-sm text-muted">Gestionar casos de estudio</span>
        </Link>
        <Link
          href="/admin/company"
          className="focus-ring flex w-56 flex-col gap-1 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
        >
          <span className="font-medium text-foreground">Company</span>
          <span className="text-sm text-muted">
            Editar el perfil público de la empresa
          </span>
        </Link>
        <Link
          href="/admin/team"
          className="focus-ring flex w-56 flex-col gap-1 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
        >
          <span className="font-medium text-foreground">Team</span>
          <span className="text-sm text-muted">
            Gestionar miembros del equipo
          </span>
        </Link>
        <Link
          href="/admin/clients"
          className="focus-ring flex w-56 flex-col gap-1 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
        >
          <span className="font-medium text-foreground">Clients</span>
          <span className="text-sm text-muted">Gestionar clientes</span>
        </Link>
        <Link
          href="/admin/testimonials"
          className="focus-ring flex w-56 flex-col gap-1 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
        >
          <span className="font-medium text-foreground">Testimonials</span>
          <span className="text-sm text-muted">Gestionar testimonios</span>
        </Link>
        <Link
          href="/admin/products"
          className="focus-ring flex w-56 flex-col gap-1 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
        >
          <span className="font-medium text-foreground">Products</span>
          <span className="text-sm text-muted">Gestionar productos SaaS</span>
        </Link>
        <Link
          href="/admin/partners"
          className="focus-ring flex w-56 flex-col gap-1 rounded-2xl border border-border bg-surface p-6 transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:shadow-[0_0_32px_-12px_var(--color-accent)]"
        >
          <span className="font-medium text-foreground">Partners</span>
          <span className="text-sm text-muted">Gestionar alianzas</span>
        </Link>
      </div>
    </div>
  );
}
