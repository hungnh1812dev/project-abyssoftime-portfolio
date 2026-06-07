import { getHeaderNav } from "@/services/header/header.service";

import { HeaderNavClient } from "./HeaderNav.client";

const FALLBACK = {
  brandText: "Abyssoftime",
  navItems: [
    { label: "Home", path: "/" },
    { label: "CV", path: "/cv" },
  ],
  languages: [
    { code: "en", label: "EN" },
    { code: "vi", label: "VI" },
  ],
};

export async function HeaderNav() {
  const data = await getHeaderNav();
  const { brandText, navItems, languages } = data ?? FALLBACK;
  return <HeaderNavClient brandText={brandText} navItems={navItems} languages={languages} />;
}
