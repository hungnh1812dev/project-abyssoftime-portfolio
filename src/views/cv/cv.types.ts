export interface CvSkillItem {
  name: string;
  exp: string | null;
}

export interface CvSkillCategory {
  category: string;
  items: CvSkillItem[];
}

export interface CvSkillSection {
  name: string;
  items: CvSkillCategory[];
}

export interface CvRole {
  position: string;
  period: string;
  responsibilities: string[];
  techStack: string[];
  projects: string[];
}

export interface CvExperienceItem {
  company: string;
  location: string;
  roles: CvRole[];
}

export interface CvExperienceSection {
  name: string;
  items: CvExperienceItem[];
}

export interface CvProjectItem {
  name: string;
  description: string;
  techStack: string[];
  teamSize: string;
  role: string;
  link: string | null;
  responsitoryLink: string | null;
}

export interface CvProjectSection {
  name: string;
  items: CvProjectItem[];
}

export interface CvEducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string | null;
}

export interface CvEducationSection {
  name: string;
  items: CvEducationItem[];
}

export interface CvLanguageItem {
  language: string;
  level: string;
}

export interface CvLanguageSection {
  name: string;
  items: CvLanguageItem[];
}

export interface CvSummarySection {
  name: string;
  description: string;
}

export interface CvContactAvatar {
  url: string;
}

export interface CvContact {
  name: string;
  location: string;
  phone: string;
  email: string;
  linkedIn: string;
  github: string;
  avatar: CvContactAvatar | null;
}

export interface CvContactData {
  cvContact: CvContact;
}

export interface CvPage {
  documentId: string;
  isMain: boolean;
  companyName: string;
  position: string;
  summary: CvSummarySection;
  skills: CvSkillSection[];
  experiences: CvExperienceSection[];
  projects: CvProjectSection[];
  education: CvEducationSection[];
  languages: CvLanguageSection[];
}

export interface CvPageData {
  cvPages: CvPage[];
}
