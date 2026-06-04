import { NextRequest, NextResponse } from "next/server";
import { i18nMiddleware } from "./i18n";

export function middleware(req: NextRequest): NextResponse {
  return i18nMiddleware(req) ?? NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
