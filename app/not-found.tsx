import { Button } from "@/components/ui/Button";
import { siteMeta } from "@/lib/content/site";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div
        aria-hidden="true"
        className="animate-fade-in-up flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-background"
      >
        <span className="font-[family-name:var(--font-display)] text-2xl font-bold">
          CH
        </span>
      </div>

      <div className="animate-fade-in-up [animation-delay:80ms]">
        <p className="font-[family-name:var(--font-display)] text-6xl font-bold text-foreground">
          404
        </p>
        <p className="mt-3 text-muted">
          Esta página no existe o fue movida. {siteMeta.name} sigue en{" "}
          <span className="text-foreground">/</span>.
        </p>
      </div>

      <Button href="/" className="animate-fade-in-up [animation-delay:160ms]">
        Volver al inicio
      </Button>
    </div>
  );
}
