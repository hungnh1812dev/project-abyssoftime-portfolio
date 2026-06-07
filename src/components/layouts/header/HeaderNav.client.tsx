"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useLocale } from "@/lib/hooks/useLocale";
import type { LanguageItem, NavItem } from "@/services/header/header.types";

interface HeaderNavClientProps {
  brandText: string;
  navItems: NavItem[];
  languages: LanguageItem[];
}

function LanguageSwitcher({ languages }: { languages: LanguageItem[] }) {
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (languages.length === 0) return null;

  if (languages.length === 1) {
    return (
      <span className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground">
        {languages[0].label}
      </span>
    );
  }

  if (languages.length === 2) {
    const other = languages.find((l) => l.code !== locale) ?? languages[0];
    return (
      <button
        onClick={() => setLocale(other.code)}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {other.label}
      </button>
    );
  }

  const active = languages.find((l) => l.code === locale) ?? languages[0];
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        aria-expanded={open}
      >
        {active.label}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 min-w-[4rem] rounded-md border border-border bg-background py-1 shadow-md">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLocale(lang.code);
                setOpen(false);
              }}
              className={cn(
                "w-full px-3 py-1.5 text-left text-sm transition-colors hover:bg-accent",
                lang.code === locale ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function HeaderNavClient({ brandText, navItems, languages }: HeaderNavClientProps) {
  const { locale } = useLocale();
  const pathname = usePathname();
  const { toggle } = useTheme();

  return (
    <header className="no-print sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <Link
        href={`/${locale}`}
        className="text-sm font-semibold tracking-wide text-foreground transition-opacity hover:opacity-70"
      >
        {brandText}
      </Link>

      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const href = item.path === "/" ? `/${locale}` : `/${locale}${item.path}`;
          const active =
            item.path === "/"
              ? pathname === `/${locale}` || pathname === `/${locale}/`
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={item.path}
              href={href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm transition-colors",
                active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-1">
        <LanguageSwitcher languages={languages} />
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
