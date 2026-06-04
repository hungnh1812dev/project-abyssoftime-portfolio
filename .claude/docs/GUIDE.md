# Claude Code Usage Guide — Project Abyssoftime

## Purpose

This file helps optimize token usage when working with Claude Code. Instead of reading the entire CLAUDE.md each session, only load the relevant docs for the current task.

---

## New Session Workflow

### Step 1 — Read CLAUDE.md (required)

CLAUDE.md at root contains: stack, pages map, path aliases, conventions. Read it once.

### Step 2 — Identify the task, read only related docs

```
Task: Add new page             → read architecture/routing-i18n.md + architecture/layouts.md
Task: Styling/theme            → read architecture/styling.md
Task: Write tests              → read dev/testing.md
```

### Step 3 — Read the necessary source files

From the docs, you know the exact file paths → read directly, no need to scan the entire codebase.

---

## Map: Task → Docs to Read

| Task                    | Docs                                                      | Source files                                      |
| ----------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| Add new page            | `architecture/routing-i18n.md`, `architecture/layouts.md` | `app/[locale]/(main)/`, `components/layouts/`     |
| Edit styling/theme      | `architecture/styling.md`                                 | `assets/styles/globals.css`, `tailwind.config.ts` |
| Edit data fetch         | `dev/data-fetching.md`                                    | `api/fetchApi.ts`, `mocks/`                       |
| Write tests             | `dev/testing.md`                                          | `e2e/`, `__mocks/`                                |
| Add shared component    | `architecture/overview.md`                                | `components/ui/`, `components/ui-cms/`            |

---

## .claude/docs/ Structure

```
.claude/docs/
├── GUIDE.md                    ← This file
├── architecture/
│   ├── overview.md             ← Overall project structure
│   ├── routing-i18n.md         ← Routing + i18n middleware
│   ├── layouts.md              ← 3-level layout hierarchy
│   ├── styling.md              ← Tailwind + CSS variables + dark mode
└── dev/
    ├── commands.md             ← npm scripts, build, lint
    ├── data-fetching.md        ← API wrapper + mock system
    └── testing.md              ← Jest + Playwright strategy
```

---

## Token Optimization Tips

1. **Don't read the whole codebase** — Only read files explicitly referenced in docs
2. **Read docs in layers** — CLAUDE.md → page doc → source file (skip source if docs are sufficient)
3. **Use the Explore agent** for broad searches (grep, find) instead of manually reading many files
4. **Read in sections** of large files (offset + limit) instead of reading the entire file

---

## Quick Conventions

```bash
# Root path for all source files:
src/

# Run dev server:
bun run dev

# Add new page:
1. Create app/[locale]/(main)/<name>/page.tsx
2. Create views/<name>/<NameView>.tsx
3. Import view into page.tsx
4. Add to PAGES array in views/home/Home.tsx

# Naming:
- Views: PascalCase (VocabularyPage.tsx)
- Hooks: camelCase with use prefix (useLearnedWords.ts)
- Types: PascalCase ending with DataType or Type (CvDataType)
- Folders: KebabCase (/cv-content/CvContent.tsx)

# Components:
- Always break into smaller meaningful components for maintainability.
- Always distinguish Server components from client components ("use client")
- Components should be placed in their own sub-folder

```
