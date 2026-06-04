# CV Page

## URL

```
/[locale]/cv   →  e.g. /en/cv
```

## Files

| File | Role |
|---|---|
| `src/app/[locale]/(main)/cv/page.tsx` | Route — calls service, renders CvView |
| `src/views/cv/CvView.tsx` | Orchestrator — composes all CV sections |
| `src/views/cv/cv.service.ts` | Server-only — calls `graphqlApi.query` with `GET_MAIN_CV` |
| `src/views/cv/cv.queries.ts` | GraphQL query string |
| `src/views/cv/cv.types.ts` | All TypeScript types for the CV data shape |
| `src/views/cv/components/CvHeader.tsx` | Name, title, contact info (static personal data) |
| `src/views/cv/components/CvSummary.tsx` | Professional summary section |
| `src/views/cv/components/CvSkills.tsx` | Technical skills grid (multi-category) |
| `src/views/cv/components/CvExperience.tsx` | Professional experience with roles |
| `src/views/cv/components/CvProjects.tsx` | Featured projects with links |
| `src/views/cv/components/CvEducation.tsx` | Education section |
| `src/views/cv/components/CvLanguages.tsx` | Languages section |
| `src/views/cv/components/CvPrintButton.tsx` | Client component — calls `window.print()` |
| `src/views/cv/components/CvSectionTitle.tsx` | Shared section heading (blue uppercase + border) |
| `src/mocks/cv-page.ts` | Mock data matching full PDF content |

## Data Flow

```
page.tsx (Server)
  └── getMainCv()           ← cv.service.ts → graphqlApi → GET_MAIN_CV
        └── CvPage | null
              └── CvView    ← passes cv prop down to all section components
```

## GraphQL Query

Uses `GET_MAIN_CV` — fetches a single CV where `isMain: true`.  
Response key: `cvPages[0]`  
Mock key: `"cv-page"` → `src/mocks/cv-page.ts`

## Static Personal Info

Name, phone, email, LinkedIn, GitHub are **hardcoded** in `CvHeader.tsx` (not from GraphQL).  
These rarely change and are personal/not CMS-managed.

## Print Support

- `CvPrintButton` calls `window.print()` — browser print dialog handles PDF export.
- Elements with class `no-print` are hidden via `@media print { .no-print { display: none } }` in `globals.css`.
- ThemeToggle and PrintButton both carry `no-print`.

## Extending

**Add a new section**: create `src/views/cv/components/CvNewSection.tsx`, add the field to `cv.types.ts` and `cv.queries.ts`, import in `CvView.tsx`.

**Change personal info**: edit the `PERSONAL` constant in `CvHeader.tsx`.
