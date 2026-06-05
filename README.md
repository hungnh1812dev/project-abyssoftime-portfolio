# Project Abyssoftime — Portfolio

Personal portfolio built with Next.js 15 App Router, TypeScript, and Tailwind CSS.

---

## Getting Started

```bash
bun install
bun run dev      # → http://localhost:4000
```

Other commands:

```bash
bun run build    # Production build
bun start        # Production server → http://localhost:5005
bun run lint     # ESLint
```

---

## Data Fetching

This project uses a **Driver-keyed Service Registry** pattern. All data flows through a single `unifyFetch` entry point — components never call the API transport layer directly.

### Flow

```
Page (Server Component)
  → accessor function  (e.g. getMainCv)
    → unifyFetch({ apiKey, driver?, params? })
      → registered service handler
        → graphqlApi / restfulApi
          → fetch()
```

---

### Using data in a Server Component

Import the accessor functions from the relevant service file and call them in your async page component. Use `Promise.all` for parallel fetching.

```tsx
// src/app/[locale]/(main)/my-page/page.tsx
import { getMainCv, getContact } from "@/views/cv/cv.service";
import { getCommonText } from "@/services/common-text/common-text.service";

export default async function MyPage() {
  const [cv, contact, commonText] = await Promise.all([
    getMainCv(),
    getContact(),
    getCommonText(),
  ]);

  if (!cv) return <p>Not available.</p>;

  return <MyView data={cv} contact={contact} commonText={commonText} />;
}
```

Accessor functions accept an optional `params` object for query variables (`lang`, `pageSize`, `pageStart`, `limit`, etc.):

```tsx
const cv = await getMainCv({ lang: "vi", pageSize: 5 });
```

---

### Creating a new service

Follow these steps. File location rule: shared by 2+ pages → `src/services/<name>/`; single page only → `src/views/<page>/`.

#### Step 1 — Types (`my-feature.types.ts`)

```ts
export interface MyFeatureItem {
  id: string;
  title: string;
}

export interface MyFeatureData {
  myFeature: MyFeatureItem;
}
```

#### Step 2 — Query (`my-feature.queries.ts`)

```ts
export const GET_MY_FEATURE = `
  query {
    myFeature {
      id
      title
    }
  }
`;
```

#### Step 3 — Service (`my-feature.service.ts`)

```ts
import graphqlApi from "@/api/graphqlApi";
import { registerService } from "@/api/registry";
import { unifyFetch } from "@/api/fetcher";
import { GET_MY_FEATURE } from "./my-feature.queries";
import type { MyFeatureItem, MyFeatureData } from "./my-feature.types";

// Key constant — export for test mocking
export const MY_FEATURE_KEY = "my-feature" as const;

// Private handler — only implementation lives here
async function _fetchMyFeature(params?: unknown): Promise<MyFeatureItem | null> {
  const data = await graphqlApi.fetch<MyFeatureData>({
    body: { query: GET_MY_FEATURE },
    mock: "my-feature",             // key in src/mocks/mock-all.ts
    next: { revalidate: 300, tags: ["my-feature"] },
  });
  return data.myFeature ?? null;
}

// Register — runs once on module import (SSG build time)
registerService({ key: MY_FEATURE_KEY, driver: "graphql", execute: _fetchMyFeature });

// Public accessor — this is what pages import and call
export async function getMyFeature(
  params?: Record<string, unknown>,
): Promise<MyFeatureItem | null> {
  return unifyFetch<MyFeatureItem | null>({ apiKey: MY_FEATURE_KEY, params });
}
```

#### Step 4 — Mock data (`src/mocks/`)

Add a mock file `src/mocks/my-feature.ts` and register it in `src/mocks/mock-all.ts`:

```ts
// mock-all.ts
import myFeatureMock from "./my-feature";

export const MockView: Record<string, unknown> = {
  // ...existing mocks
  "my-feature": myFeatureMock,
};
```

Mock data must match the **full API response shape** (not just the inner object):

```ts
// src/mocks/my-feature.ts
export default {
  myFeature: {
    id: "1",
    title: "Mock Title",
  },
};
```

#### Step 5 — Use in a page

```tsx
import { getMyFeature } from "@/services/my-feature/my-feature.service";

export default async function MyPage() {
  const item = await getMyFeature();
  if (!item) return <p>Not available.</p>;
  return <div>{item.title}</div>;
}
```

---

## Project Structure

```
src/
├── app/[locale]/(main)/   ← Next.js pages (Server Components)
├── views/                 ← Feature components + page-specific services
├── components/            ← Shared UI components
├── services/              ← Shared services (used by 2+ pages)
├── api/
│   ├── registry.ts        ← Service registry
│   ├── fetcher.ts         ← unifyFetch entry point + transport dispatcher
│   ├── graphqlApi.ts      ← GraphQL transport
│   └── restfulApi.ts      ← REST transport
└── mocks/                 ← Mock data (fallback on network errors)
```

For deeper documentation see [`.claude/docs/`](.claude/docs/GUIDE.md).
