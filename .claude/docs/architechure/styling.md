# Styling

## Principles

- **Tailwind-first**: No custom CSS. All `*.module.css` files in the project are empty.
- **cn() utility**: `clsx` + `twMerge` — import from `@/lib/utils`
- **CVA**: class-variance-authority for component variants
- **CSS Modules**: Not used

## CSS Custom Properties (HSL Variables)

File: `src/assets/styles/globals.css`

```css
/* Light mode (:root) */
--background: 0 0% 100%;
--foreground: 20 14.3% 4.1%;
--card: 0 0% 100%;
--primary: 24 9.8% 10%;
--secondary: 60 4.8% 95.9%;
--muted: 60 4.8% 95.9%;
--accent: 60 4.8% 95.9%;
--destructive: 0 84.2% 60.2%;
--border: 20 5.9% 90%;
--input: 20 5.9% 90%;
--ring: 20 14.3% 4.1%;
--radius: 0.5rem;

/* Dark mode (.dark) — activated when class="dark" is on <html> */
--background: 20 14.3% 4.1%;
--foreground: 60 9.1% 97.8%;
/* ... */
```

Usage in Tailwind: `bg-background`, `text-foreground`, `border-border`, etc.

## Dark Mode

Strategy: `class` (in `tailwind.config.ts`) — add/remove `dark` class on `<html>`.

### Global system (ThemeProvider + ThemeToggle)

| File                                     | Role                                                              |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `components/providers/ThemeProvider.tsx` | `"use client"` — context `{ theme, toggle }`, syncs localStorage  |
| `components/ui/ThemeToggle.tsx`          | `"use client"` — fixed bottom-right button, Sun/Moon icon         |
| `components/layouts/root/LayoutRoot.tsx` | Wraps app with `ThemeProvider`, renders `ThemeToggle`, FOUC script |
| `components/html-locale/HtmlLocale.tsx`  | `suppressHydrationWarning` on `<html>` to avoid hydration error   |

**FOUC prevention** — inline script in `<body>` runs before React hydration:

```js
try {
  var t = localStorage.getItem("theme");
  if (
    t === "dark" ||
    (!t && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  }
} catch (e) {}
```

**Hydration notes**:

- `suppressHydrationWarning` on `<html>` — allows class mismatch (script adds `dark` before React)
- `ThemeToggle` uses a `mounted` guard — renders a placeholder `<span>` on server, real icon after mount

**Note**: `views/cv/DarkModeToggle.tsx` is the old, page-specific toggle — does not use context/localStorage. Do not delete (used in CV page), but it is not the main system.

## Tailwind Config

File: `application/tailwind.config.ts`

```typescript
darkMode: ["class"],
content: [
  "./src/pages/**/*.{ts,tsx}",
  "./src/components/**/*.{ts,tsx}",
  "./src/app/**/*.{ts,tsx}",
  "./src/views/**/*.{ts,tsx}",  // ← scan views folder
],
// All colors map to CSS HSL variables
// Plugin: tailwindcss-animate
```

## shadcn/ui Config

File: `application/components.json`

```json
{
  "style": "new-york",
  "baseColor": "stone",
  "iconLibrary": "lucide",
  "rsc": true
}
```

## Prettier

File: `application/.prettierrc`

```json
{
  "printWidth": 180,
  "singleQuote": false,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

The `prettier-plugin-tailwindcss` plugin auto-sorts Tailwind classes in canonical order.

## CVA Pattern (Component Variants)

```typescript
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva("base-classes", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      outline: "border border-input",
    },
    size: {
      default: "h-9 px-4 py-2",
      sm: "h-8 px-3",
      lg: "h-10 px-6",
    },
  },
  defaultVariants: { variant: "default", size: "default" },
});
```

## HTMLParser + Tailwind (CV Page)

Styling HTML content parsed via `html-react-parser`:

```tsx
<div className="[&>p]:-mt-1 [&>li]:pb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:pt-1">
  <HTMLParser>{htmlString}</HTMLParser>
</div>
```

## CodeMirror Theme (JsonInput)

File: `src/components/ui-cms/json-input/JsonInput.tsx`

- Background: `hsl(var(--card))`
- Text: `hsl(var(--foreground))`
- Selection: `hsl(var(--accent))`
- Height: 300px fixed
