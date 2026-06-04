import type { CvPage, CvContact } from "./cv.types";
import type { CommonText } from "@/services/common-text/common-text.types";
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
  contact: CvContact;
  commonText: CommonText | null;
}

export function CvView({ cv, contact, commonText }: CvViewProps) {
  return (
    <div className="min-h-screen bg-white text-foreground dark:bg-background">
      <div className="mx-auto max-w-4xl px-8 py-10 print:px-0 print:py-0">
        <CvHeader contact={contact} position={cv.position} commonText={commonText} />
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
