import type { CvSkillSection } from "../cv.types";
import { CvSectionTitle } from "./CvSectionTitle";

interface CvSkillsProps {
  skillSections: CvSkillSection[];
}

export function CvSkills({ skillSections }: CvSkillsProps) {
  const section = skillSections[0];
  if (!section) return null;

  return (
    <section className="mb-6">
      <CvSectionTitle title={section.name} />
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3">
        {section.items.map((cat) => (
          <div key={cat.category}>
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{cat.category}</h3>
            <div className="flex flex-wrap gap-1.5">
              {cat.items.map((skill) => (
                <span key={skill.name} className="rounded border border-border px-2 py-0.5 text-xs text-foreground">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
