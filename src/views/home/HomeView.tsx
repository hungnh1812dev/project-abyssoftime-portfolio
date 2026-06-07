import type { HomeData } from "./home.types";
import { HomeHero } from "./hero/HomeHero";
import { HomeImpact } from "./impact/HomeImpact";
import { HomeProjects } from "./projects/HomeProjects";
import { HomeSpecializations } from "./specializations/HomeSpecializations";
import { HomeSkills } from "./skills/HomeSkills";
import { HomeContact } from "./contact/HomeContact";

interface HomeViewProps {
  data: HomeData;
  locale: string;
}

export function HomeView({ data, locale }: HomeViewProps) {
  const { page, contact } = data;

  return (
    <main>
      <HomeHero page={page} contact={contact} locale={locale} />
      <HomeImpact stats={page.impactStats} title={page.sectionTitles.impact} />
      <HomeProjects items={page.projects} title={page.sectionTitles.projects} />
      <HomeSpecializations items={page.specializations} title={page.sectionTitles.specializations} />
      <HomeSkills items={page.skills} title={page.sectionTitles.skills} />
      <HomeContact contact={contact} title={page.sectionTitles.contact} />
    </main>
  );
}
