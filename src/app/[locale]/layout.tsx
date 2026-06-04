import type { BaseLayoutProps } from "@/types/BasicType";
import { LayoutLocale } from "@/components/layouts/locale/LayoutLocale";

export default async function LocaleLayout({ children, params }: BaseLayoutProps) {
  const { locale } = await params;
  return <LayoutLocale locale={locale ?? "en"}>{children}</LayoutLocale>;
}
