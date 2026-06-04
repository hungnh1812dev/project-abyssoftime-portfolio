import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LayoutMainProps {
  children: ReactNode;
  className?: string;
}

export function LayoutMain({ children, className }: LayoutMainProps) {
  return <main className={cn("bg-background text-foreground", className)}>{children}</main>;
}
