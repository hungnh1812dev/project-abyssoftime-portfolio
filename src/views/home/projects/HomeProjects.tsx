import Image from "next/image";
import { ExternalLink as ExternalLinkIcon } from "lucide-react";

import UrlLink from "@/lib/external-link/ExternalLink";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "../home.types";

interface HomeProjectsProps {
  items: PortfolioProject[];
  title: string;
}

function ProjectCard({ project, featured }: { project: PortfolioProject; featured?: boolean }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-muted/30">
      {/* Thumbnail — optional, always full width, 16:9 ratio */}
      {project.thumbnail && (
        <div className="relative aspect-video w-full overflow-hidden border-b border-border">
          <Image
            src={project.thumbnail}
            alt={`${project.title} preview`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 960px"
          />
        </div>
      )}

      {/* Content + Outcomes row */}
      <div className={cn("flex flex-col", featured && "lg:flex-row")}>
        {/* Main content */}
        <div className={cn("flex flex-col gap-4 p-6 sm:p-8", featured && "lg:w-1/2 lg:border-r lg:border-border")}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {project.role} · {project.period}
              </p>
            </div>
            {project.link && (
              <UrlLink
                href={project.link}
                aria-label={`View ${project.title}`}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLinkIcon size={16} />
              </UrlLink>
            )}
          </div>

          <p className="text-base italic text-muted-foreground">&ldquo;{project.tagline}&rdquo;</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Challenge</p>
              <p className="text-sm leading-relaxed">{project.challenge}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approach</p>
              <p className="text-sm leading-relaxed">{project.approach}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border/60 bg-background px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Outcomes */}
        <div
          className={cn(
            "border-t border-border bg-muted/40 p-6 sm:p-8",
            featured && "lg:w-1/2 lg:border-t-0",
          )}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Outcomes</p>
          <dl aria-label="Outcomes" className="grid grid-cols-2 gap-4">
            {project.outcomes.map((outcome) => (
              <div key={outcome.label} className="flex flex-col">
                <dt className="text-2xl font-bold tracking-tight">{outcome.value}</dt>
                <dd className="mt-0.5 text-sm text-muted-foreground">{outcome.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </article>
  );
}

export function HomeProjects({ items, title }: HomeProjectsProps) {
  const [featured, ...rest] = items;

  return (
    <section id="projects" aria-labelledby="projects-title" className="py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h2 id="projects-title" className="mb-10 text-2xl font-semibold tracking-tight">{title}</h2>

        <div className="flex flex-col gap-6">
          {featured && <ProjectCard project={featured} featured />}
          {rest.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
