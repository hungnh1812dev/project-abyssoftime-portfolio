import type { Metadata } from "next";
import type { BasePageProps } from "@/types/BasicType";
import { getMainCv } from "@/views/cv/cv.service";
import { CvView } from "@/views/cv/CvView";

export const metadata: Metadata = { title: "CV" };

export default async function CvPage({ params }: BasePageProps) {
  await params;
  const cv = await getMainCv();

  if (!cv) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">CV not available.</p>
      </div>
    );
  }

  return <CvView cv={cv} />;
}
