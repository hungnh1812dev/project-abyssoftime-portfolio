# Testing Strategy

## Stack

| Tool | Role |
| --- | --- |
| **Vitest** | Test runner & assertion |
| **@testing-library/react** | Component rendering |
| **@testing-library/user-event** | User interaction simulation |
| **jsdom** | DOM environment |

Config: [vitest.config.ts](../../../vitest.config.ts) — `src/**/*.{test,spec}.{ts,tsx}`, globals enabled, jsdom environment.

Run command: `bun run vitest`

---

## Test Files

### `src/api/fetchApi.test.ts` — 10 tests

Source: [src/api/fetchApi.ts](../../../src/api/fetchApi.ts)

`fetchApi.get(url, options?)` — thin GET wrapper with mock fallback.

| Group | Cases |
| --- | --- |
| Success paths | Returns JSON on `ok`, sends `GET`, custom headers forwarded, correct URL, extra `RequestInit` options (e.g. `cache`) |
| Mock fallback | Network error → mock, non-ok response → mock |
| Error paths | Network error (no mock) → generic throw, non-ok (no mock) → generic throw, unknown mock key → throws |

**Key behavior**: `catch {}` always swallows the original error — both network and non-ok failures throw `"Request failed for: <url>"`.

---

### `src/api/graphqlApi.test.ts` — 19 tests

Source: [src/api/graphqlApi.ts](../../../src/api/graphqlApi.ts)

`graphqlApi.query(options)` — GraphQL POST wrapper with mock fallback.

| Group | Cases |
| --- | --- |
| Success paths | Full data returned, `dataKey` extraction, `Content-Type` header, `GRAPHQL_TOKEN` auth, `next.revalidate` forwarded |
| Mock fallback | Network error, non-ok response, empty array data, GraphQL errors in response |
| Error paths | Network error (no mock) rethrows original, GraphQL errors joined with `;`, unknown mock key, null `data` with no mock, `dataKey` resolves to null |
| Request options | `variables` in body, custom `url`, `cache` option, `STRAPI_API_TOKEN` fallback auth |
| Mock not triggered | Live data returned even when `mock` option is set but fetch succeeds |

**Key behavior**: Unlike `fetchApi`, rethrows the original error when no mock is provided — callers get the real network/GraphQL message.

---

### `src/lib/html-parser/index.test.tsx` — 13 tests

Source: [src/lib/html-parser/index.tsx](../../../src/lib/html-parser/index.tsx)

`<HTMLParser content component? className?>` — sanitizes HTML via DOMPurify then renders with `html-react-parser`.

| Group | Cases |
| --- | --- |
| Render basics | Empty string → null, plain text, HTML tags parsed, default `div` wrapper, custom element via `component` prop, `className` applied |
| XSS sanitization | `<script>` stripped, `onerror` attribute stripped |
| Structure & links | Nested `<ul>/<li>` preserved, safe `<a href>` kept, `javascript:` href stripped, HTML entities decoded |

---

### `src/views/cv/footer/PrintButton.test.tsx` — 9 tests

Source: [src/views/cv/footer/PrintButton.tsx](../../../src/views/cv/footer/PrintButton.tsx)

`<PrintButton className?>` — button that calls `window.print()`.

| Group | Cases |
| --- | --- |
| Render | Button with label "Print / Save PDF", no error when `className` omitted |
| Interaction | Single click → `window.print()` called once, no call before interaction, multiple clicks → called N times, keyboard Enter triggers print |
| Props | `className` applied, no `"undefined"` in class when prop is omitted |

---

## Isolation Patterns

```ts
// Stub global APIs
vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(data) }));
vi.stubGlobal("print", vi.fn());

// Stub env vars + reset module cache (for module-level env reads)
vi.stubEnv("GRAPHQL_TOKEN", "test-token");
vi.resetModules();
const { default: api } = await import("./graphqlApi");

// Always restore in afterEach
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
```

---

## Coverage Summary

| File | Tests | Branches covered |
| --- | --- | --- |
| fetchApi.ts | 10 | ok / non-ok / network error / mock fallback / unknown mock |
| graphqlApi.ts | 19 | all of the above + `dataKey` / variables / custom URL / cache / STRAPI token / empty array / mock bypass |
| html-parser/index.tsx | 13 | empty / text / HTML / XSS / custom wrapper / links / entities |
| PrintButton.tsx | 9 | render / click / multi-click / keyboard / className edge case |
| **Total** | **51** | |
