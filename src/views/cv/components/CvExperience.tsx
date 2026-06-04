import type { CvExperienceSection } from "../cv.types";
import { CvSectionTitle } from "./CvSectionTitle";

interface CvExperienceProps {
  experienceSections: CvExperienceSection[];
}

export function CvExperience({ experienceSections }: CvExperienceProps) {
  const section = experienceSections[0];
  if (!section) return null;

  return (
    <section className="mb-6">
      <CvSectionTitle title={section.name} />
      <div className="flex flex-col gap-6">
        {section.items.map((item) => (
          <div key={item.company}>
            <div className="mb-3 flex items-baseline gap-2">
              <h3 className="text-base font-bold text-blue-600 dark:text-blue-400">{item.company}</h3>
              <span className="text-sm text-muted-foreground">· {item.location}</span>
            </div>

            <div className="flex flex-col gap-5">
              {item.roles.map((role) => (
                <div key={`${role.position}-${role.period}`} className="pl-0">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-semibold text-foreground">{role.position}</h4>
                    <span className="shrink-0 text-sm text-muted-foreground">{role.period}</span>
                  </div>

                  {role.projects.length > 0 && (
                    <p className="mt-0.5 text-sm text-blue-500 dark:text-blue-400">
                      <span className="font-medium">Projects:</span> {role.projects.join(", ")}
                    </p>
                  )}

                  {role.techStack.length > 0 && (
                    <p className="mt-0.5 text-sm">
                      <span className="font-medium text-orange-500 dark:text-orange-400">Technologies:</span>{" "}
                      <span className="text-muted-foreground">{role.techStack.join(", ")}</span>
                    </p>
                  )}

                  {role.responsibilities.length > 0 && (
                    <div className="mt-1">
                      <p className="text-sm font-medium text-blue-500 dark:text-blue-400">Responsibilities &amp; Contributions:</p>
                      <ul className="mt-1 list-disc pl-5 text-sm leading-relaxed text-foreground">
                        {role.responsibilities.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
