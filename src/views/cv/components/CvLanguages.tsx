import type { CvLanguageSection } from "../cv.types";
import { CvSectionTitle } from "./CvSectionTitle";

interface CvLanguagesProps {
  languageSections: CvLanguageSection[];
}

export function CvLanguages({ languageSections }: CvLanguagesProps) {
  const section = languageSections[0];
  if (!section) return null;

  return (
    <section className="mb-6">
      <CvSectionTitle title={section.name} />
      <div className="flex flex-wrap gap-6">
        {section.items.map((item) => (
          <span key={item.language} className="text-sm text-foreground">
            <span className="font-bold">{item.language}</span>{" "}
            <span className="text-muted-foreground">{item.level}</span>
          </span>
        ))}
      </div>
    </section>
  );
}
