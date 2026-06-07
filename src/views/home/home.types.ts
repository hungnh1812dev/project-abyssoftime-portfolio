import type { Contact } from "@/services/contact/contact.types";

export type { Contact } from "@/services/contact/contact.types";

export interface PortfolioMetric {
  value: string;
  label: string;
  note?: string;
}

export interface PortfolioProject {
  title: string;
  tagline: string;
  role: string;
  period: string;
  challenge: string;
  approach: string;
  outcomes: PortfolioMetric[];
  techStack: string[];
  thumbnail?: string | null;
  link?: string;
  repositoryLink?: string;
}

export interface PortfolioSpecialization {
  title: string;
  description: string;
}

export interface HomeSkillCategory {
  category: string;
  items: string[];
}

export interface HomePageData {
  headline: string;
  subheadline: string;
  impactStats: PortfolioMetric[];
  projects: PortfolioProject[];
  specializations: PortfolioSpecialization[];
  skills: HomeSkillCategory[];
  sectionTitles: {
    impact: string;
    projects: string;
    specializations: string;
    skills: string;
    contact: string;
  };
}

export interface HomePageQueryData {
  homePage: HomePageData;
}

export interface HomeData {
  page: HomePageData;
  contact: Contact;
}
