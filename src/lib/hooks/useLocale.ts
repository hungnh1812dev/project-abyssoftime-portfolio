"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

import { defaultLocale } from "@/utils/Constants";

export function useLocale() {
  const { locale } = useParams<{ locale?: string }>();
  const pathname = usePathname();
  const router = useRouter();

  const setLocale = useCallback(
    (newLocale: string) => {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      const newPath = pathname.replace(/^\/[a-z]{2}(\/|$)/, `/${newLocale}$1`);
      router.push(newPath);
    },
    [pathname, router],
  );

  return { locale: locale ?? defaultLocale, setLocale };
}
