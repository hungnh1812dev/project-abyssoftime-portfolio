import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ExternalLink as ExternalLinkIcon, Mail, MapPin } from "lucide-react";

import UrlLink from "@/lib/external-link/ExternalLink";
import localAvatar from "@/images/avatar.jpg";
import type { Contact } from "@/services/contact/contact.types";
import type { HomePageData } from "../home.types";

interface HomeHeroProps {
  page: HomePageData;
  contact: Contact;
  locale: string;
}

export function HomeHero({ page, contact, locale }: HomeHeroProps) {
  return (
    <section id="hero" aria-label="Introduction" className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          {/* Text */}
          <div className="text-center lg:max-w-[58%] lg:text-left">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Available for new projects
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{page.headline}</h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {page.subheadline}
            </p>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground/60 lg:justify-start">
              <MapPin aria-hidden="true" size={13} />
              <span>{contact.location}</span>
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <Link
                href={`/${locale}/cv`}
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-80"
              >
                View CV
                <ArrowRight aria-hidden="true" size={14} />
              </Link>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground lg:justify-start">
              {contact.github && (
                <UrlLink
                  href={contact.github}
                  className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <ExternalLinkIcon aria-hidden="true" size={13} />
                  GitHub
                </UrlLink>
              )}
              {contact.github && contact.linkedIn && <span className="text-border">·</span>}
              {contact.linkedIn && (
                <UrlLink
                  href={contact.linkedIn}
                  className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <ExternalLinkIcon aria-hidden="true" size={13} />
                  LinkedIn
                </UrlLink>
              )}
              {(contact.github || contact.linkedIn) && contact.email && (
                <span className="text-border">·</span>
              )}
              {contact.email && (
                <UrlLink
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  <Mail aria-hidden="true" size={14} />
                  Email
                </UrlLink>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div className="flex shrink-0 flex-col items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 scale-[1.12] rounded-full border border-dashed border-border/50" />
              <Image
                src={contact.avatar?.url ?? localAvatar}
                alt={`${contact.name} profile photo`}
                width={256}
                height={256}
                priority
                className="h-44 w-44 rounded-full border-2 border-border object-cover sm:h-52 sm:w-52 lg:h-60 lg:w-60"
              />
            </div>
            <div className="rounded-full border border-border/60 bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              React · Next.js · TypeScript
            </div>
          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <a href="#impact" aria-label="Scroll down">
            <ChevronDown size={20} className="animate-bounce text-muted-foreground/40" />
          </a>
        </div>
      </div>
    </section>
  );
}
