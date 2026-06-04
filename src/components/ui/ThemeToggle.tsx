"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="no-print fixed bottom-4 right-4 z-50 rounded-full bg-primary p-2 text-primary-foreground shadow-md transition-colors hover:opacity-80"
    >
      {mounted ? theme === "dark" ? <Sun size={18} /> : <Moon size={18} /> : <span className="block h-[18px] w-[18px]" />}
    </button>
  );
}
