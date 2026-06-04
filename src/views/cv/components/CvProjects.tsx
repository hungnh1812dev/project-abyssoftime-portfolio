import type { CvProjectSection } from "../cv.types";
import { CvSectionTitle } from "./CvSectionTitle";

interface CvProjectsProps {
  projectSections: CvProjectSection[];
}

export function CvProjects({ projectSections }: CvProjectsProps) {
  const section = projectSections[0];
  if (!section) return null;

  return (
    <section className="mb-6">
      <CvSectionTitle title={section.name} />
      <div className="flex flex-col gap-5">
        {section.items.map((project) => (
          <div key={project.name}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-bold text-foreground">{project.name}</h3>
              <span className="text-sm text-muted-foreground">
                {project.role} · {project.teamSize}
              </span>
            </div>

            <div className="mt-0.5 flex flex-wrap gap-1.5">
              <span className="text-sm font-medium text-orange-500 dark:text-orange-400">Technologies:</span>
              {project.techStack.map((t) => (
                <span key={t} className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>

            {project.description && (
              <p className="mt-1 text-sm leading-relaxed text-foreground">{project.description}</p>
            )}

            <div className="mt-1 flex flex-wrap gap-4 text-xs">
              {project.link && (
                <span>
                  <span className="font-medium text-blue-500 dark:text-blue-400">Live: </span>
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline">
                    {project.link}
                  </a>
                </span>
              )}
              {project.responsitoryLink && (
                <span>
                  <span className="font-medium text-blue-500 dark:text-blue-400">GitHub: </span>
                  <a href={project.responsitoryLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline">
                    {project.responsitoryLink}
                  </a>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
