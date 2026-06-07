import type { Metadata } from "next";
import type { BasePageProps } from "@/types/BasicType";
import { getMainCv, getContact } from "@/views/cv/cv.service";
import { getCommonText } from "@/services/common-text/common-text.service";
import { CvView } from "@/views/cv/CvView";
import { PageEmptyState } from "@/components/ui/PageEmptyState";

export const metadata: Metadata = { title: "CV" };

export default async function CvPage({ searchParams }: BasePageProps) {
  const sp = await searchParams;
  const hideAvatar = sp["no-avatar"] === "1";

  const [cv, contact, commonText] = await Promise.all([getMainCv(), getContact(), getCommonText()]);

  if (!cv || !contact) return <PageEmptyState />;

  return <CvView data={cv} contact={contact} commonText={commonText} hideAvatar={hideAvatar} />;
}
