import type { BaseLayoutProps } from "@/types/BasicType";
import { LayoutMain } from "@/components/layouts/main/LayoutMain";

export default function MainLayout({ children }: BaseLayoutProps) {
  return <LayoutMain>{children}</LayoutMain>;
}
