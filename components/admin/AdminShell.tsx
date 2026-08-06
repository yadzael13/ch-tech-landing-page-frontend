"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { siteMeta } from "@/lib/content/site";

export default function AdminShell({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [isLoading, isAuthenticated, router]);

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted">
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    // The redirect effect above handles navigation — render nothing while it
    // takes effect instead of flashing protected chrome.
    return null;
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/admin"
            className="focus-ring rounded font-[family-name:var(--font-display)] text-lg font-semibold text-foreground"
          >
            {siteMeta.name} — Admin
          </Link>
          <nav
            aria-label="Admin"
            className="flex flex-wrap items-center gap-x-6 gap-y-2"
          >
            <Link
              href="/admin/projects"
              className="focus-ring rounded text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              Projects
            </Link>
            <Link
              href="/admin/services"
              className="focus-ring rounded text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              Services
            </Link>
            <Link
              href="/admin/technologies"
              className="focus-ring rounded text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              Technologies
            </Link>
            <Link
              href="/admin/articles"
              className="focus-ring rounded text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              Articles
            </Link>
            <Link
              href="/admin/case-studies"
              className="focus-ring rounded text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              Case Studies
            </Link>
            <Link
              href="/admin/company"
              className="focus-ring rounded text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              Company
            </Link>
            <Link
              href="/admin/team"
              className="focus-ring rounded text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              Team
            </Link>
            <Link
              href="/admin/clients"
              className="focus-ring rounded text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              Clients
            </Link>
            <Link
              href="/admin/testimonials"
              className="focus-ring rounded text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              Testimonials
            </Link>
            <Link
              href="/admin/products"
              className="focus-ring rounded text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              Products
            </Link>
            <Link
              href="/admin/partners"
              className="focus-ring rounded text-sm text-muted transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              Partners
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="focus-ring rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:border-accent hover:text-accent active:scale-[0.98]"
            >
              Salir
            </button>
          </nav>
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-6xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}
