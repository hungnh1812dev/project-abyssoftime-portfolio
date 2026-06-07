"use client";

import { LinkProps } from "next/dist/client/link";
import Link from "next/link";
import React from "react";

import { useLocale } from "@/lib/hooks/useLocale";
import { locales } from "@/utils/Constants";

import { createRegex } from "../function/regex";

export type UrlLinkProps = {
  children?: React.ReactNode;
  href: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  Omit<LinkProps, "href"> &
  React.RefAttributes<HTMLAnchorElement>;

function isAbsoluteUrl(url: string): boolean {
  return /^(https?:\/\/|\/\/|tel:|mailto:)/.test(url);
}

const ExternalLink = React.forwardRef<HTMLAnchorElement, UrlLinkProps>((props, ref) => {
  const { target, rel, href, passHref, ...orders } = props;
  const { locale } = useLocale();
  const isAbsolute = isAbsoluteUrl(href);
  const domain = href ? href.replace(/(https?:\/\/)?(www.)?/, "") : undefined;
  const isSameDomain = domain
    ? !isAbsolute ||
      (typeof window !== "undefined"
        ? domain.startsWith(window.location.hostname) || domain.startsWith("project-abyssoftime-portfolio.vercel.app")
        : domain.startsWith("project-abyssoftime-portfolio.vercel.app") || false)
    : false;

  let targetHref = href || "";
  if (!isAbsolute) {
    let hasLocale = false;
    for (const lang of locales) {
      if (createRegex(`(\/${lang}$)|(^\/${lang}\/)|(^${lang}\/)`).test(href)) {
        hasLocale = true;
        break;
      }
    }
    targetHref = hasLocale ? href : href?.startsWith("/") ? `/${locale}${href}` : `/${locale}/${href}`;
  }

  return isSameDomain ? (
    <Link href={targetHref} target={target || "_self"} rel={rel || ""} passHref={passHref} {...orders} ref={ref}>
      {props.children}
    </Link>
  ) : (
    <a href={href} target={target || "_blank"} rel={rel || "noopener noreferrer"} {...orders} ref={ref}>
      {props.children}
    </a>
  );
});

ExternalLink.displayName = "ExternalLink";

export default ExternalLink;
