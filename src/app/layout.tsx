import type { Metadata } from "next";
import "./globals.css";
import { LayoutRoot } from "@/components/layouts/root/LayoutRoot";
import type { BaseLayoutProps } from "@/types/BasicType";

export const metadata: Metadata = {
  title: { template: "%s | Abyssoftime", default: "Abyssoftime" },
  description: "Personal portfolio & CV of Nguyen Huy Hung",
  robots: { index: false, follow: false },
};

export default async function RootLayout({ children, params }: BaseLayoutProps) {
  const { locale } = await params;
  return <LayoutRoot locale={locale ?? "en"}>{children}</LayoutRoot>;
}
