import ExternalLink from "@/lib/external-link/ExternalLink";

import { CvContact, CvPage } from "../cv.types";
import { CvHeaderClient } from "./CvHeader.client";

interface CvHeaderProps {
  contact: CvContact;
  position: CvPage["position"];
}

export const CvHeader = ({ contact, position }: CvHeaderProps) => {
  return (
    <CvHeaderClient avartar={contact.avatar}>
      <h1 className="m-0 text-2xl font-bold tracking-tight md:text-3xl">{contact.name}</h1>
      <h2 className="m-0 mt-0.5 text-sm font-medium text-foreground/60 sm:text-base">{position}</h2>
      <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-foreground/65 sm:text-sm group-[.text-center]:justify-center">
        <span>{contact.location}</span>
        <span className="text-foreground/30">·</span>
        <ExternalLink href={`tel:${contact.phone}`} className="hover:text-blue-600 hover:underline">
          {contact.phone}
        </ExternalLink>
        <span className="text-foreground/30">·</span>
        <ExternalLink href={`mailto:${contact.email}`} className="hover:text-blue-600 hover:underline">
          {contact.email}
        </ExternalLink>
        <span className="text-foreground/30">·</span>
        <ExternalLink href={contact.linkedIn} className="hover:text-blue-600 hover:underline">
          LinkedIn
        </ExternalLink>
        <span className="text-foreground/30">·</span>
        <ExternalLink href={contact.github} className="hover:text-blue-600 hover:underline">
          GitHub
        </ExternalLink>
      </div>
    </CvHeaderClient>
  );
};
