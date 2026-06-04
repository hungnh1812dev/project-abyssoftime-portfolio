# Architecture Overview

## Monorepo Structure

```
project-abyssoftime/
├── src/
│   ├── app/                    ← App Router
│   │   ├── layout.tsx          → LayoutRoot
│   │   └── [locale]/
│   │       ├── layout.tsx      → LayoutLocale
│   │       └── (main)/
│   │           ├── layout.tsx  → LayoutMain
│   │           ├── page.tsx    → Home
│   ├── views/                  ← Feature components (folder per page)
│   ├── components/
│   │   ├── layouts/            ← LayoutRoot, LayoutLocale, LayoutMain
│   │   ├── ui/                 ← Reusable UI components (buttons, box, card, ...)
│   │   ├── html-locale/        ← <html lang> setter
│   │   └── providers/          ← Context providers
│   ├── lib/
│   │   └── html-parser/        ← html-react-parser wrapper
│   ├── api/
│   │   └── fetchApi.ts         ← Fetch + mock fallback
│   ├── mocks/
│   │   ├── mock-all.ts         ← Registry: Record<string, any>
│   ├── types/BasicType.ts      ← BaseLayoutProps, BasePageProps
│   ├── utils/Constants.ts      ← locales, defaultLocale
│   └── assets/
│       ├── styles/*  ← Tailwind + CSS HSL variables
│       └── images/*
├── e2e/                        ← Playwright E2E tests
├── __mocks/                    ← Jest mocks
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .claude/
    ├── docs/                       ← Docs per page/module
    └── settings.json
```

## Organization Principles

- Each page has 1 folder in `views/` containing all logic for that page
- `components/` only contains shared components used across multiple pages
- `components/ui/` — Contains reusable UI components (buttons, box, card, ...)

## Key Types

```typescript
// src/types/BasicType.ts
interface BaseLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

interface BasePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string>>;
}
```

Extend these two interfaces for every new layout/page.
