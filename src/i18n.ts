import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/utils/Constants";

function detectLocale(req: NextRequest): string {
  const cookie = req.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && locales.includes(cookie)) return cookie;

  const acceptLang = req.headers.get("accept-language") ?? "";
  for (const part of acceptLang.split(",")) {
    const lang = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (locales.includes(lang)) return lang;
  }

  return defaultLocale;
}

export function i18nMiddleware(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return null;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) return null;

  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}
