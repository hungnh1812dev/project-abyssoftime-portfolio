# Data Fetching & Mock System

## API Layer Overview

```
src/api/
  fetcher.ts      ← Unified entry point (recommended for new services)
  graphqlApi.ts   ← GraphQL driver — POST, auth headers, selectKey extraction
  restfulApi.ts   ← HTTP transport layer — the only place fetch() is called
```

**Dependency chain**: `fetcher` → `graphqlApi` / `restfulApi`; `graphqlApi` uses `restfulApi` internally.

---

## Unified Fetcher (`fetcher.ts`) — Recommended

Single entry point. Use `driver` to select the backend (default: `'graphql'`).

```typescript
import fetcher from "@/api/fetcher";

// GraphQL (default)
const data = await fetcher<CvPageData>({
  driver: "graphql",
  body: { query: GET_MAIN_CV },
  mock: "cv-page",
  next: { revalidate: 300, tags: ["cv"] },
});

// REST
const posts = await fetcher<Post[]>({
  driver: "rest",
  url: "/api/posts",
  method: "GET",
  next: { revalidate: 60 },
});
```

### `FetcherOptions`

| Field       | Type                                  | Default      | Notes                                      |
| ----------- | ------------------------------------- | ------------ | ------------------------------------------ |
| `driver`    | `'graphql' \| 'rest'`                 | `'graphql'`  | Selects backend                            |
| `url`       | `string`                              | —            | Required for REST; optional for GraphQL (uses `GRAPHQL_URL` env) |
| `body`      | `unknown`                             | —            | GraphQL: `{ query, variables? }`; REST: any payload |
| `method`    | `'GET' \| 'POST' \| 'PUT' \| 'DELETE'` | `'GET'`    | REST only; ignored by GraphQL (always POST) |
| `headers`   | `Record<string, string>`              | —            | Merged with auto-injected auth (GraphQL)   |
| `selectKey` | `string`                              | —            | Extract `response.data[key]` (GraphQL) or `response[key]` (REST) |
| `mock`      | `string`                              | —            | Key in `MockView` — fallback on failure    |
| `next`      | `{ revalidate?, tags? }`              | —            | Next.js ISR options                        |
| `cache`     | `RequestCache`                        | —            | Native fetch cache option                  |

---

## GraphQL API (`graphqlApi.ts`)

Direct use is still supported for existing services.

```typescript
import graphqlApi from "@/api/graphqlApi";

const data = await graphqlApi.fetch<CvPageData>({
  body: { query: GET_MAIN_CV, variables: { id: 1 } },
  mock: "cv-page",
  next: { revalidate: 300, tags: ["cv"] },
});
```

**Logic:**
1. Auth headers (GRAPHQL_TOKEN → STRAPI_API_TOKEN) auto-injected
2. POST via `restfulApi` to `GRAPHQL_URL` (env) or custom `url`
3. If `json.errors` present AND no mock → throw `Error` with messages
4. If `json.data` valid → return `data[selectKey]` or full `data`
5. If data null/[] → fall to mock (if provided) or throw

**Mock behavior**: mock covers network errors, HTTP errors, GraphQL errors, and empty data. When `json.errors` is present but mock is also provided, mock takes priority.

---

## REST API (`restfulApi.ts`)

Used internally by `graphqlApi`. Can also be used directly.

```typescript
import restfulApi from "@/api/restfulApi";

const result = await restfulApi.fetch<Post>({
  url: "/api/posts/1",
  method: "GET",
  next: { revalidate: 60 },
});
```

**Logic:**
1. Calls native `fetch()` — the only place in the codebase that does
2. `res.ok` → parse JSON → return (with optional `selectKey` extraction)
3. HTTP error (non-ok) → throw `ApiError` with `.status` + `.info` (parsed body) — **not** masked by mock
4. Network error → fall to mock (if provided) or throw

**`ApiError` shape** (compatible with SWR, React Query, Next.js error boundaries):

```typescript
interface ApiError extends Error {
  status?: number;  // HTTP status code
  info?: unknown;   // parsed response body
}
```

---

## Error Handling & Package Compatibility

All errors are thrown as `Error` instances (or `ApiError` subtype):

| Package | Integration |
| ------- | ----------- |
| **Next.js** (Server Components) | `throw` propagates to `error.tsx` boundary |
| **SWR** | `error` state populated; `error.status` + `error.info` available |
| **React Query** | `error` state populated automatically |
| **RTK Query** | Fetchers throw; wrap in `baseQuery` catch → `rejectWithValue` |

---

## Service Location Rule

```
Is this service/query used by more than one page?
  YES → src/services/<name>/          ← shared, global service
  NO  → src/views/<page>/             ← co-located with the page
```

### Global Service Structure (`src/services/`)

```
src/services/
└── common-text/
    ├── common-text.types.ts    ← TypeScript types
    ├── common-text.queries.ts  ← GraphQL query string
    └── common-text.service.ts  ← exported async function(s)
```

### Co-located Service Structure (`src/views/<page>/`)

```
src/views/cv/
├── cv.types.ts
├── cv.queries.ts
└── cv.service.ts
```

**Rule**: promote to `src/services/<name>/` when a second page needs the same query.

---

## Mock Registry

File: `src/mocks/mock-all.ts`

```typescript
export const MockView: Record<string, unknown> = {
  "cv-page": cvPageMock,
  "cv-contact": cvContactMock,
  "common-text": commonTextMock,
};
```

Mock data must match the full API response shape — e.g. `{ cvPages: [...] }`, not the inner object.
`selectKey` extraction is skipped when falling back to mock; return the raw shape.

## Adding a New Mock

1. Create `src/mocks/<key>.ts` with data matching the API response shape
2. Import and register in `MockView` in `mock-all.ts`
3. Pass the key: `fetcher({ mock: "<key>", ... })`

---

## Parallel Fetching (multiple queries per page)

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
