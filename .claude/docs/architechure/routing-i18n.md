# Routing & i18n

## URL Structure

```
/{locale}/{path}
  ├── /en/         → Home
  └── /en/*        → Home
```

The `[locale]` segment values: `en` | `vi` (defined in `utils/Constants.ts`)

## i18n Middleware

File: `src/i18n.ts` — detects locale from:

1. `NEXT_LOCALE` cookie
2. `Accept-Language` header
3. Redirects to `/{locale}{path}`

File: `src/proxy.ts` — Next.js middleware entry, calls `i18n.ts`

## Adding a New Page

### 1. Create route file

```
src/app/[locale]/(main)/<name>/page.tsx
```

```typescript
import { BasePageProps } from "@/types/BasicType";
import { NameView } from "@/views/<name>/NameView";

export default async function NamePage({ params, searchParams }: BasePageProps) {
  const { locale } = await params;
  return <NameView locale={locale} />;
}
```

### 2. Create view component

```
src/views/<name>/NameView.tsx
```

### 3. Add to Home

Add an entry to the `PAGES` array in `src/views/home/Home.tsx`:

```typescript
{
  href: `/${locale}/<name>`,
  title: "Display Name",
  description: "Short description",
  icon: <IconName className="..." />,
}
```

## Locale Constants

```typescript
// src/utils/Constants.ts
export const locales = ["en", "vi"];
export const defaultLocale = "en";
```

## Getting Locale in a Component

**Server component**: `const { locale } = await params`

**Client component**: `const { locale } = useParams<{ locale: string }>()`
