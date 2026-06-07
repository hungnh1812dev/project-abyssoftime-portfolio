import type { HeaderNavData } from "@/services/header/header.types";

export const headerNavMock: HeaderNavData = {
  headerNav: {
    brandText: "Abyssoftime",
    navItems: [
      { label: "Home", path: "/" },
      { label: "CV", path: "/cv" },
    ],
    languages: [
      { code: "en", label: "EN" },
      { code: "vi", label: "VI" },
    ],
  },
};
