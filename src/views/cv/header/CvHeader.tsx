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
          <a href={`tel:${contact.phone}`} className="hover:text-blue-600 hover:underline">
            {contact.phone}
          </a>
          <span className="text-foreground/30">·</span>
          <a href={`mailto:${contact.email}`} className="hover:text-blue-600 hover:underline">
            {contact.email}
          </a>
          <span className="text-foreground/30">·</span>
          <a target="_blank" rel="noopener noreferrer" href={contact.linkedIn} className="hover:text-blue-600 hover:underline">
            LinkedIn
          </a>
          <span className="text-foreground/30">·</span>
          <a target="_blank" rel="noopener noreferrer" href={contact.github} className="hover:text-blue-600 hover:underline">
            GitHub
          </a>
        </div>
    </CvHeaderClient>
  );
}