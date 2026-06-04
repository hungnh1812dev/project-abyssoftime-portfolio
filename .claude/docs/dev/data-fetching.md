# Data Fetching & Mock System

## GraphQL API Wrapper

File: `src/api/graphqlApi.ts`

Logic:
1. POST to `GRAPHQL_URL` with `{ query, variables }`
2. If successful and no errors → return `data[dataKey]` or `data` if no `dataKey`
3. If failed AND `mock` key provided → return `MockView[mock]` from `src/mocks/mock-all.ts`

```typescript
// Usage in a service file (server-only)
const data = await graphqlApi.query<CvPageData>({
  query: GET_MAIN_CV,
  mock: "cv-page",
  next: { revalidate: 300 },
});
```

## Service Location Rule

```
Is this service/query used by more than one page?
  YES → src/services/<name>/          ← shared, global service
  NO  → src/views/<page>/             ← co-located with the page
```

### Global Service Structure (`src/services/`)

Each global service lives in its own **subfolder** named after the domain:

```
src/services/
└── common-text/
    ├── common-text.types.ts    ← TypeScript types
    ├── common-text.queries.ts  ← GraphQL query string
    └── common-text.service.ts  ← exported async function(s)
```

**Naming**: folder and files use `kebab-case`, all three files share the same prefix.

### Co-located Service Structure (`src/views/<page>/`)

```
src/views/cv/
├── cv.types.ts
├── cv.queries.ts
└── cv.service.ts
```

**Rule**: promote a co-located service to `src/services/<name>/` when a second page needs the same query.

## Mock Registry

File: `src/mocks/mock-all.ts`

```typescript
import { cvPageMock } from "./cv-page";
import { cvContactMock } from "./cv-contact";
import { commonTextMock } from "./common-text";

export const MockView: Record<string, unknown> = {
  "cv-page": cvPageMock,
  "cv-contact": cvContactMock,
  "common-text": commonTextMock,
};
```

Mock data shape must match the full API response (e.g. `{ cvPages: [...] }`, not just the inner object).
`graphqlApi` bypasses `dataKey` extraction when falling back to mock — return the raw shape.

## Adding a New Mock

1. Create `src/mocks/<key>.ts` with data matching the API response shape
2. Import and register in `MockView` in `mock-all.ts`
3. Pass the key to the service: `graphqlApi.query({ mock: "<key>" })`

## Parallel Fetching (multiple queries per page)

Use `Promise.all` in the page route when fetching independent data sources:

```typescript
// app/[locale]/(main)/cv/page.tsx
const [cv, contact, commonText] = await Promise.all([
  getMainCv(),
  getContact(),
  getCommonText(),
]);
```

## ISR / Revalidation

```typescript
next: { revalidate: 300 }   // 5 min — frequently updated content (cv sections)
next: { revalidate: 3600 }  // 1 hr  — rarely updated content (contact, common text)
```
