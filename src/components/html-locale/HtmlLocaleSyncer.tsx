"use client";

import { useEffect } from "react";

import { useLocale } from "@/lib/hooks/useLocale";

export function HtmlLocaleSyncer() {
  const { locale } = useLocale();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
