import type { ReactNode } from "react";

interface LayoutLocaleProps {
  locale: string;
  children: ReactNode;
}

export function LayoutLocale({ children }: LayoutLocaleProps) {
  return <>{children}</>;
}
