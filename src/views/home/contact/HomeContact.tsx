import { ExternalLink, Mail } from "lucide-react";
import type { Contact } from "@/services/contact/contact.types";

interface HomeContactProps {
  contact: Contact;
  title: string;
}

export function HomeContact({ contact, title }: HomeContactProps) {
  return (
    <section id="contact" className="border-t border-border/40 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="rounded-2xl border border-border/60 bg-muted/30 px-6 py-14 text-center sm:px-12 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            Whether you have a project in mind, a role to fill, or just want to say hi — my inbox is always open.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-80"
              >
                <Mail size={14} />
                {contact.email}
              </a>
            )}

            <div className="flex items-center gap-3">
              {contact.github && (
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  GitHub
                  <ExternalLink size={12} />
                </a>
              )}
              {contact.linkedIn && (
                <a
                  href={contact.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  LinkedIn
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
