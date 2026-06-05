# API Driver Pattern — Driver-keyed Service Registry

> **Date**: 2026-06-06  
> **Status**: Implemented  
> **Scope**: `src/api/`

---

## Context

Codebase cần một kiến trúc data fetching cho phép:
- Services không được gọi trực tiếp trong component — phải đi qua một entry point thống nhất
- Mỗi service tự đăng ký với một key riêng
- Component lấy data qua accessor function → accessor gọi unify fetcher
- Có thể swap transport (graphql/rest) mà không sửa caller

---

## Design Pattern

### Tên chính thức: **Driver-keyed Service Registry**

Kết hợp của:
- **Registry Pattern** — services tự đăng ký (side-effect on import), unify fetcher tra cứu theo key
- **Strategy Pattern** (GoF) — `driver` là chiều thứ hai của tra cứu, cho phép swap transport mà không đổi caller
- **Service Locator** — `unifyFetch` là locator, lookup bằng composite key `driver:apiKey`

Một số tên tương đương tùy context:
- **Driver Pattern** — cách Knex, Sequelize xử lý database dialects
- **Provider Pattern** — cách Auth.js, Next.js xử lý providers

---

## Kiến trúc 3 lớp

```
Page Component
  → accessor function (getMainCv, getContact, getCommonText)
    → unifyFetch({ apiKey, driver?, params? })    ← Registry layer
      → lookupService(driver, apiKey)
        → registered execute(params)              ← Service handler
          → graphqlApi / restfulApi               ← Transport layer (Strategy)
            → fetch()
```

---

## Cấu trúc file

```
src/api/
├── registry.ts         ← Service registry (Driver-keyed)
├── fetcher.ts          ← Transport dispatcher (default) + unifyFetch (named)
├── graphqlApi.ts       ← GraphQL transport strategy
└── restfulApi.ts       ← REST transport strategy
```

---

## Interface

### `registry.ts`

```typescript
export type ServiceDriver = "graphql" | "rest";

export interface ServiceRegistration<T = unknown> {
  key: string;
  driver: ServiceDriver;
  execute: (params?: unknown) => Promise<T>;
}

export function registerService<T>(reg: ServiceRegistration<T>): void;
export function lookupService(apiKey: string, driver: ServiceDriver): ServiceRegistration;
export function clearRegistry(): void; // test-only, DCE'd in production
```

**Composite key format**: `driver:apiKey` — driver đứng trước để group theo transport khi debug.

### `fetcher.ts`

```typescript
// Existing — transport-level dispatch (unchanged)
export default fetcher(options: FetcherOptions): Promise<T>;

// New — registry-level dispatch
export interface UnifyFetchOptions {
  apiKey: string;
  driver?: ServiceDriver;   // defaults to "graphql"
  params?: Record<string, unknown>; // forwarded to execute(params)
}
export function unifyFetch<T>(opts: UnifyFetchOptions): Promise<T>;
```

---

## Service file convention

Mỗi service file theo đúng cấu trúc sau:

```typescript
// 1. Export key constants (for test mocking)
export const MY_SERVICE_KEY = "my.service" as const;

// 2. Private implementation handler
async function _fetchData(params?: unknown): Promise<MyType | null> {
  // params cast internally when needed: const { lang } = params as MyParams;
  const data = await graphqlApi.fetch<MyQueryData>({
    body: { query: MY_QUERY },
    mock: "my-mock",
    next: { revalidate: 300, tags: ["my-tag"] },
  });
  return data.myField ?? null;
}

// 3. Registration (module-level side effect — runs on import)
registerService({ key: MY_SERVICE_KEY, driver: "graphql", execute: _fetchData });

// 4. Public accessor (what components call — goes through unify fetcher)
export async function getMyData(
  params?: Record<string, unknown>,
): Promise<MyType | null> {
  return unifyFetch<MyType | null>({ apiKey: MY_SERVICE_KEY, params });
}
```

---

## `params` — Extra query options

`params` được forward từ accessor → `unifyFetch` → `execute`. Dùng để truyền query options: `lang`, `locale`, `pageSize`, `pageStart`, `limit`, v.v.

Service handler nhận `params?: unknown` và tự cast khi cần:
```typescript
async function _fetchData(params?: unknown): Promise<MyType | null> {
  const { lang = "en" } = (params ?? {}) as { lang?: string };
  const data = await graphqlApi.fetch({
    body: { query: MY_QUERY, variables: { locale: lang } },
    ...
  });
}
```

---

## Trade-offs

### Lợi ích

| # | Lợi ích | Chi tiết |
|---|---------|----------|
| 1 | **Testability** | Test chỉ cần `registerService` mock vào registry, không cần mock toàn bộ `graphqlApi` |
| 2 | **Decoupling** | Accessor/component chỉ biết `apiKey`, không biết transport là graphql hay rest |
| 3 | **Swappability** | Cùng một `apiKey`, đăng ký thêm driver `rest` → đổi driver ở call site mà không sửa service logic |
| 4 | **Interceptability** | Logic cross-cutting (logging, retry, metrics) viết 1 lần trong `unifyFetch` — áp dụng cho mọi service |

### Hạn chế & rủi ro

| # | Hạn chế | Chi tiết |
|---|---------|----------|
| 1 | **Invisible runtime dependency** | Nếu service file chưa được import (chưa đăng ký) trước khi `unifyFetch` gọi → throw lúc runtime, không có lỗi compile-time |
| 2 | **Module-level side effects** | `registerService(...)` chạy khi file được import — có thể gây bất ngờ nếu dev không quen pattern; khó kiểm soát thứ tự |
| 3 | **Key collision** | Hai service dùng cùng `apiKey` + `driver` → cái sau overwrite cái trước silently. **Giảm thiểu**: tất cả `en` pages là SSG — registration chạy đúng một lần lúc build, deterministic; collision lộ ra ngay qua dữ liệu sai trong build output hoặc test |
| 4 | **`clearRegistry` trong bundle** | Test-only helper được guard bằng `process.env.NODE_ENV === "production"` — Next.js/webpack/turbopack DCE block này trong production build |
| 5 | **Stack trace sâu hơn** | Accessor → `unifyFetch` → `lookupService` → `execute` — thêm 2 indirection layer so với gọi `graphqlApi.fetch` trực tiếp |

---

## So sánh

| | Trước (direct import) | Driver Pattern (fetcher) | Registry Pattern (unifyFetch) |
|--|----------------------|--------------------------|-------------------------------|
| Component import | Service trực tiếp | Service trực tiếp | Accessor function |
| Transport coupling | Rõ (tên module) | Qua `driver` field | Ẩn sau `apiKey` |
| Test seam | Mock `graphqlApi` | Mock `graphqlApi` | Mock registry entry |
| Thêm transport mới | Sửa service | Đổi `driver` field | Đăng ký key+driver mới |
| Cross-cutting logic | Phân tán | Tập trung ở fetcher | Tập trung ở `unifyFetch` |
| Params support | Qua function args | Qua options | Qua `params` field |
