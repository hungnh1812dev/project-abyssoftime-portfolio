import { MockView } from "../mocks/mock-all";

export interface ApiError extends Error {
  status?: number;
  info?: unknown;
}

export interface RestOptions {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  selectKey?: string;
  mock?: string;
  next?: { revalidate?: number | false; tags?: string[] };
  cache?: RequestCache;
}

const restfulFetch = async <T>(options: RestOptions): Promise<T> => {
  const { url, method = "GET", body, headers, selectKey, mock, next, cache } =
    options;

  try {
    const res = await fetch(url, {
      method,
      ...(body !== undefined && {
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json", ...headers },
      }),
      ...(body === undefined && headers && { headers }),
      ...(next && { next }),
      ...(cache && { cache }),
    });

    if (res.ok) {
      const json: unknown = await res.json();
      const result = selectKey
        ? (json as Record<string, unknown>)[selectKey]
        : json;
      if (result != null && !(Array.isArray(result) && result.length === 0))
        return result as T;
    } else {
      let info: unknown;
      try {
        info = await res.json();
      } catch {
        /* ignore parse failure */
      }
      const err = new Error(
        `HTTP ${res.status}: Request failed for ${url}`,
      ) as ApiError;
      err.status = res.status;
      if (info !== undefined) err.info = info;
      throw err;
    }
  } catch (err) {
    // HTTP errors (ApiError with status) are not masked by mock
    if ((err as ApiError).status !== undefined) throw err;
    // Network errors fall through to mock
    if (mock) {
      const data = MockView[mock];
      if (data !== undefined) return data as T;
    }
    throw err;
  }

  // res.ok but result was null or empty array
  if (mock) {
    const data = MockView[mock];
    if (data !== undefined) return data as T;
  }

  throw new Error(`Request failed for: ${url}`);
};

const restfulApi = { fetch: restfulFetch };
export default restfulApi;
