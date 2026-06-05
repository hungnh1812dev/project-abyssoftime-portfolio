import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import HtmlLocale from "@/components/html-locale/HtmlLocale";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

interface LayoutRootProps {
  locale: string;
  children: ReactNode;
}

export function LayoutRoot({ locale, children }: LayoutRootProps) {
  return (
    <HtmlLocale lang={locale}>
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches)){document.documentElement.classList.add("dark")}}catch(e){}`,
          }}
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </HtmlLocale>
  );
}
