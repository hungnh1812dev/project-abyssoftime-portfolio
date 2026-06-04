import type { CvSummarySection } from "../cv.types";
import { CvSectionTitle } from "./CvSectionTitle";

interface CvSummaryProps {
  summary: CvSummarySection;
}

export function CvSummary({ summary }: CvSummaryProps) {
  return (
    <section className="mb-6">
      <CvSectionTitle title={summary.name} />
      <p className="text-sm leading-relaxed text-foreground">{summary.description}</p>
    </section>
  );
}
