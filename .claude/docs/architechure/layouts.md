# Layout Hierarchy

## Three-Level Layout

```
app/layout.tsx              → LayoutRoot
  └── app/[locale]/layout.tsx       → LayoutLocale
        └── app/[locale]/(main)/layout.tsx  → LayoutMain
              └── page.tsx → <ViewComponent />
```

## Level 1 — LayoutRoot

File: `src/components/layouts/root/LayoutRoot.tsx`

- Imports `globals.css`
- Font: Inter (next/font/google)
- Wraps in `<HtmlLocale lang={locale}>` + `<body className={inter.className}>`
- Metadata template: `"%s | Abyssoftime"`

## Level 2 — LayoutLocale

File: `src/components/layouts/locale/LayoutLocale.tsx`

- Pass-through `<>{children}</>`
- Exists so Next.js handles the `[locale]` segment correctly

## Level 3 — LayoutMain

File: `src/components/layouts/main/LayoutMain.tsx`

- Wraps in `<main className={cn("bg-background text-foreground", className)}>`
- Semantic HTML `<main>` tag
- Applies background + text color from CSS variables

## HtmlLocale Component

File: `src/components/html-locale/HtmlLocale.tsx`

- Client component (`"use client"`)
- Dynamically sets `<html lang={locale}>` based on route
- Placed in LayoutRoot to cover the entire app

## Layout Data Flow

```typescript
// app/layout.tsx
export default async function RootLayout({ children, params }: BaseLayoutProps) {
  const { locale } = await params;
  return <LayoutRoot locale={locale}>{children}</LayoutRoot>;
}

// app/[locale]/layout.tsx
export default async function LocaleLayout({ children, params }: BaseLayoutProps) {
  const { locale } = await params;
  return <LayoutLocale locale={locale}>{children}</LayoutLocale>;
}

// app/[locale]/(main)/layout.tsx
export default async function MainLayout({ children }: BaseLayoutProps) {
  return <LayoutMain>{children}</LayoutMain>;
}
```

## Adding a New Layout

Only needed when adding a new route group. Always extend `BaseLayoutProps` from `src/types/BasicType.ts`.
