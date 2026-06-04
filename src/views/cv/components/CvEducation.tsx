import type { CvEducationSection } from "../cv.types";
import { CvSectionTitle } from "./CvSectionTitle";

interface CvEducationProps {
  educationSections: CvEducationSection[];
}

export function CvEducation({ educationSections }: CvEducationProps) {
  const section = educationSections[0];
  if (!section) return null;

  return (
    <section className="mb-6">
      <CvSectionTitle title={section.name} />
      <div className="flex flex-col gap-3">
        {section.items.map((item, i) => (
          <div key={i} className="flex items-baseline justify-between">
            <div>
              <h3 className="font-bold text-foreground">{item.degree}</h3>
              <p className="text-sm text-muted-foreground">
                {item.institution} · {item.location}
              </p>
              {item.description && <p className="mt-0.5 text-sm text-foreground">{item.description}</p>}
            </div>
            <span className="shrink-0 text-sm text-muted-foreground">{item.period}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
