# Data Fetching & Mock System

## fetchApi Wrapper

File: `src/api/fetchApi.ts`

Logic:

1. Call `fetch(url, options)`
2. If successful → `return res.json()`
3. If failed AND has a `mock` key → `return MockView[mock]` from `src/mocks/mock-all.ts`

```typescript
// Usage in server component
const data = await fetchApi<CvPageDataType>({
  url: "http://localhost:5000/graphql",
  mock: "cv-page",
  next: { revalidate: 300 },
});
```

## Mock Registry

File: `src/mocks/mock-all.ts`

```typescript
import { cvPageMock } from "./cv-page";

export const MockView: Record<string, unknown> = {
  "cv-page": cvPageMock,
  // add new mocks here
};
```

## Adding a New Mock

1. Create `src/mocks/<page-name>.ts` with the data
2. Import and add to `MockView` in `mock-all.ts`
3. Use the key in `fetchApi({ mock: "<key>" })`

## ISR / Revalidation

```typescript
next: {
  revalidate: 300;
}
```
