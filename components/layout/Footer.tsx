import { footer, siteMeta } from "@/lib/content/site";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-foreground">
            {siteMeta.name}
          </p>
          <p className="mt-1 max-w-sm text-sm text-muted">{footer.tagline}</p>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex gap-4 text-sm text-muted">
            <a
              href={`mailto:${siteMeta.email}`}
              className="focus-ring rounded transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              {siteMeta.email}
            </a>
            {footer.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="focus-ring rounded transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
              >
                {social.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted">
            <span>
              © {new Date().getFullYear()} {siteMeta.author}
            </span>
            <a
              href="#top"
              className="focus-ring rounded transition-[color,border-color,box-shadow,opacity,transform] duration-200 ease-in-out hover:text-accent"
            >
              Volver arriba ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
