import Image from "next/image";
import { Mail, MapPin, Phone, GitBranch, BriefcaseBusiness } from "lucide-react";
import type { CvContact } from "../cv.types";
import type { CommonText } from "@/services/common-text/common-text.types";

interface CvHeaderProps {
  contact: CvContact;
  position: string;
  commonText: CommonText | null;
}

export function CvHeader({ contact, position, commonText }: CvHeaderProps) {
  const initials = contact.name
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("");

  return (
    <header className="mb-6 flex gap-5">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full bg-muted">
        {contact.avatar?.url ? (
          <Image src={contact.avatar.url} alt={contact.name} fill className="object-cover" unoptimized />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">{initials}</div>
        )}
      </div>

      <div className="flex flex-col justify-center gap-1">
        <h1 className="text-3xl font-bold text-foreground">{contact.name}</h1>
        <p className="text-base text-muted-foreground">{position}</p>
        {commonText?.text && <p className="text-xs italic text-muted-foreground">{commonText.text}</p>}

        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin size={13} />
            {contact.location}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <Phone size={13} />
            {contact.phone}
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <Mail size={13} />
            {contact.email}
          </span>
          <span className="text-border">·</span>
          <a href={contact.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
            <BriefcaseBusiness size={13} />
            LinkedIn
          </a>
          <span className="text-border">·</span>
          <a href={contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
            <GitBranch size={13} />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
