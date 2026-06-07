"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";

export function HeaderNav() {
  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();
  const { toggle } = useTheme();

  const altLocale = locale === "en" ? "vi" : "en";
  const altLocalePath = pathname
    .split("/")
    .map((seg, i) => (i === 1 ? altLocale : seg))
    .join("/");

  const navLinks = [
    { label: "Home", href: `/${locale}`, active: pathname === `/${locale}` },
    { label: "CV", href: `/${locale}/cv`, active: pathname.startsWith(`/${locale}/cv`) },
  ];

  return (
    <header className="no-print sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <Link
        href={`/${locale}`}
        className="text-sm font-semibold tracking-wide text-foreground transition-opacity hover:opacity-70"
      >
        Abyssoftime
      </Link>

      <nav className="flex items-center gap-1">
        {navLinks.map(({ label, href, active }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm transition-colors",
              active
                ? "font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-1">
        <Link
          href={altLocalePath}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {altLocale.toUpperCase()}
        </Link>
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Moon size={16} className="dark:hidden" />
          <Sun size={16} className="hidden dark:block" />
        </button>
      </div>
    </header>
  );
}
