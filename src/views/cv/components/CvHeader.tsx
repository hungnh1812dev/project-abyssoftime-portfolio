import { Mail, MapPin, Phone, Github, Linkedin } from "lucide-react";

interface CvHeaderProps {
  position: string;
}

const PERSONAL = {
  name: "Nguyen Huy Hung",
  location: "Ho Chi Minh",
  phone: "0372802210",
  email: "hungnh1812dev@gmail.com",
  linkedin: "https://www.linkedin.com/in/hung-nguyen-huy-dev-9509531a4/",
  github: "https://github.com/hungnh1812dev",
};

export function CvHeader({ position }: CvHeaderProps) {
  return (
    <header className="mb-6 flex gap-5">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-full bg-muted">
        {/* Avatar placeholder — replace with next/image when photo is available */}
        <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">NHH</div>
      </div>

      <div className="flex flex-col justify-center gap-1">
        <h1 className="text-3xl font-bold text-foreground">{PERSONAL.name}</h1>
        <p className="text-base text-muted-foreground">{position}</p>

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {PERSONAL.location}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <Phone size={13} />
            {PERSONAL.phone}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <Mail size={13} />
            {PERSONAL.email}
          </span>
          <span className="text-border">·</span>
          <a href={PERSONAL.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
            <Linkedin size={13} />
            LinkedIn
          </a>
          <span className="text-border">·</span>
          <a href={PERSONAL.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
            <Github size={13} />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
