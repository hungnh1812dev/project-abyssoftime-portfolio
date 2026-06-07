import type { Metadata } from "next";
import type { BasePageProps } from "@/types/BasicType";
import { HomeView } from "@/views/home/HomeView";
import { getHomeData } from "@/views/home/home.service";
import { PageEmptyState } from "@/components/ui/PageEmptyState";

export const metadata: Metadata = { title: "Home" };

export default async function HomePage({ params }: BasePageProps) {
  const { locale = "en" } = await params;
  const data = await getHomeData();

  if (!data) return <PageEmptyState />;

  return <HomeView data={data} locale={locale} />;
}
