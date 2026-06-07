import type { PortfolioSpecialization } from "../home.types";

interface HomeSpecializationsProps {
  items: PortfolioSpecialization[];
  title: string;
}

export function HomeSpecializations({ items, title }: HomeSpecializationsProps) {
  return (
    <section className="border-t border-border/40 py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 className="mb-10 text-2xl font-semibold tracking-tight">{title}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-2 rounded-xl border border-border bg-muted/20 p-6 transition-colors hover:bg-muted/40"
            >
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
