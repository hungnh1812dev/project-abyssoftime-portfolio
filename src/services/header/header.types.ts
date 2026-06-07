export interface NavItem {
  label: string;
  path: string;
}

export interface LanguageItem {
  code: string;
  label: string;
}

export interface HeaderNav {
  brandText: string;
  navItems: NavItem[];
  languages: LanguageItem[];
}

export interface HeaderNavData {
  headerNav: HeaderNav;
}
