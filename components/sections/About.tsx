import { getCompany } from "@/lib/api/content";
import { about } from "@/lib/content/site";
import { cardClassName } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";

export default async function About() {
  let intro = about.fallbackIntro;

  try {
    const company = await getCompany();
    intro = company.vision ?? intro;
  } catch {
    // keep the static fallback
  }

  return (
    <Reveal
      as="section"
      id="sobre-ch-tech"
      once={false}
      className="mx-auto max-w-6xl px-6 py-24"
    >
      <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-foreground">
        {about.title}
      </h2>
      <p className="mt-4 max-w-2xl text-muted">{intro}</p>

      <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {about.points.map((point, index) => (
          <Reveal
            as="li"
            key={point.title}
            delayMs={index * 60}
            className={cardClassName({
              interactive: true,
              className: "flex gap-4",
            })}
          >
            <span className="text-sm font-semibold text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-medium text-foreground">{point.title}</p>
              <p className="mt-1 text-sm text-muted">{point.description}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Reveal>
  );
}
