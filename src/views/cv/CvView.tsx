import type { CvPage } from "./cv.types";
import { CvHeader } from "./components/CvHeader";
import { CvSummary } from "./components/CvSummary";
import { CvSkills } from "./components/CvSkills";
import { CvExperience } from "./components/CvExperience";
import { CvProjects } from "./components/CvProjects";
import { CvEducation } from "./components/CvEducation";
import { CvLanguages } from "./components/CvLanguages";
import { CvPrintButton } from "./components/CvPrintButton";

interface CvViewProps {
  cv: CvPage;
}

export function CvView({ cv }: CvViewProps) {
  return (
    <div className="min-h-screen bg-white text-foreground dark:bg-background">
      <div className="mx-auto max-w-4xl px-8 py-10 print:px-0 print:py-0">
        <CvHeader position={cv.position} />
        <CvSummary summary={cv.summary} />
        <CvSkills skillSections={cv.skills} />
        <CvExperience experienceSections={cv.experiences} />
        <CvProjects projectSections={cv.projects} />
        <CvEducation educationSections={cv.education} />
        <CvLanguages languageSections={cv.languages} />
        <CvPrintButton />
      </div>
    </div>
  );
}
