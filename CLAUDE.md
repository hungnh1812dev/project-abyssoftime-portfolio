@AGENTS.md

# CLAUDE.md

Guidelines for Claude Code when working with this repo.

> **Token tip**: Read this file first, then ONLY read the docs needed for the specific task in `.claude/docs/`. See the full guide at [`.claude/docs/GUIDE.md`](.claude/docs/GUIDE.md).

---

## Monorepo Structure

```
project-abyssoftime/
├── src/
│   ├── app/          ← Next.js App Router
│   ├── views/        ← Feature components (logic per page)
│   ├── components/   ← Shared components (layouts, ui)
│   ├── services/     ← Shared services used by 2+ pages (each in own subfolder)
│   ├── lib/          ← Utilities & libraries
│   ├── api/          ← GraphQL & REST fetch wrappers with mock fallback
│   ├── mocks/        ← Mock data (cv-page, cv-contact, common-text, ...)
│   └── assets/       ← styles, images, favicon
├── e2e/              ← Playwright tests
├── package.json
├── next.config.mjs
├── tailwind.config.ts
└── .claude/
    ├── docs/             ← Detailed docs per page/module
    └── settings.json
```

> **IMPORTANT**: Project uses **bun** (not npm).

---

## Commands

```bash
bun run dev      # Dev server → http://localhost:4000
bun run build    # Production build
bun start        # Production server → http://localhost:5005
bun run lint     # ESLint
```

---

## Main Stack

| Technology              | Version | Notes                              |
| ----------------------- | ------- | ---------------------------------- |
| Next.js                 | ^16.2.4 | App Router, React Compiler enabled |
| React                   | ^19.2.5 |                                    |
| TypeScript              | ^5      | strict mode                        |
| Tailwind CSS            | ^3.3.0  | HSL CSS variables, class dark mode |
| React Hook Form         | ^7      | + Zod validation                   |
| @tanstack/react-virtual | ^3      | Virtual scroll — Vocabulary page   |
| crypto-js               | ^4      | AES-256 encrypt/decrypt            |

---

## Pages

| URL | View Component | Type |
| --- | -------------- | ---- |

---

## Path Aliases (tsconfig.json)

```
@/*           → src/*
@/components/* → src/components/*
@/views/*     → src/views/*
@/libs/*      → src/lib/*
@/styles/*    → src/assets/styles/*
@/images/*    → src/assets/images/*
```

---

## Key Conventions

- **Routing**: All pages live under `app/[locale]/(main)/` — `[locale]` segment for i18n (`en`/`vi`)
- **Styling**: Tailwind-first, use `cn()` (`clsx` + `twMerge`), HSL CSS variables
- **Encryption**: AES-256 via `crypto-js`, random IV on each encrypt
- **Mock fallback**: `api/graphqlApi.ts` auto-falls back to `mocks/` if fetch fails
- **Prettier**: Auto-format after each edit (PostToolUse hook)
- **Services**: page-specific → co-locate in `views/<page>/`; shared (2+ pages) → `services/<name>/` subfolder with `<name>.types.ts`, `<name>.queries.ts`, `<name>.service.ts`

---

## Detailed Docs

Read only when needed — do not read all at once:

| File                                                                      | When to read                       |
| ------------------------------------------------------------------------- | ---------------------------------- |
| [GUIDE.md](.claude/docs/GUIDE.md)                                         | At the start of each new session   |
| [architecture/overview.md](.claude/docs/architecture/overview.md)         | Need to understand overall structure |
| [architecture/layouts.md](.claude/docs/architecture/layouts.md)           | Adding new layout, editing layout  |
| [architecture/routing-i18n.md](.claude/docs/architecture/routing-i18n.md) | Adding new page, editing routing   |
| [architecture/styling.md](.claude/docs/architecture/styling.md)           | Styling, theme, CSS variables      |
| [dev/commands.md](.claude/docs/dev/commands.md)                           | Build, lint, test commands         |
| [dev/data-fetching.md](.claude/docs/dev/data-fetching.md)                 | API, mock, data types              |
| [dev/testing.md](.claude/docs/dev/testing.md)                             | Testing strategy, Playwright, Jest |
