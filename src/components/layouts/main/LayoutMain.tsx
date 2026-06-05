import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HeaderNav } from "@/components/layouts/header/HeaderNav";

interface LayoutMainProps {
  children: ReactNode;
  className?: string;
}

export function LayoutMain({ children, className }: LayoutMainProps) {
  return (
    <>
      <HeaderNav />
      <main className={cn("bg-background text-foreground", className)}>{children}</main>
    </>
  );
}
