export interface CvContact {
  name: string;
  location: string;
  phone: string;
  email: string;
  linkedIn: string;
  github: string;
  avatar: { url: string } | null;
}

export interface CvPage {
  documentId: string;
  isMain: boolean;
  companyName: string;
  position: string;
  summary: {
    name: string;
    description: string;
  };
  skills: {
    name: string;
    items: {
      category: string;
      items: { name: string; exp?: string }[];
    }[];
  };
  experiences: {
    name: string;
    items: {
      company: string;
      location: string;
      roles: {
        position: string;
        period: string;
        responsibilities: string;
        techStack?: string[];
        projects?: string;
      }[];
    }[];
  };
  projects: {
    name: string;
    items: {
      name: string;
      description: string;
      techStack: string[];
      teamSize?: number;
      role?: string;
      link?: string;
      responsitoryLink?: string;
    }[];
  };
  education: {
    name: string;
    items: {
      degree: string;
      institution: string;
      location: string;
      period: string;
      description: string;
    }[];
  };
  languages: {
    name: string;
    items: {
      language: string;
      level: string;
    }[];
  };
}

export interface CvPageQueryData {
  cvPages: CvPage[];
}

export interface CvContactData {
  cvContact: CvContact;
}
