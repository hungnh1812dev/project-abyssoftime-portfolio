import type { HomeSkillCategory } from "../home.types";

interface HomeSkillsProps {
  items: HomeSkillCategory[];
  title: string;
}

export function HomeSkills({ items, title }: HomeSkillsProps) {
  return (
    <section className="border-t border-border/40 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="mb-10 text-2xl font-semibold tracking-tight">{title}</h2>

        <dl className="flex flex-col gap-3">
          {items.map(({ category, items: skills }) => (
            <div key={category} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <dt className="min-w-24 shrink-0 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {category}
              </dt>
              <dd className="text-sm text-foreground/80">{skills.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
