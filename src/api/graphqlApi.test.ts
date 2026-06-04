import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import graphqlApi from "./graphqlApi";

const QUERY = "{ items { id } }";

function mockFetch(payload: { data?: unknown; errors?: { message: string }[] }, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      json: () => Promise.resolve(payload),
    }),
  );
}

function mockFetchThrow(error = new Error("Network error")) {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(error));
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("graphqlApi.query — success paths", () => {
  it("returns full data object when no dataKey", async () => {
    mockFetch({ data: { items: [{ id: 1 }] } });
    const result = await graphqlApi.query({ query: QUERY });
    expect(result).toEqual({ items: [{ id: 1 }] });
  });

  it("extracts dataKey when provided", async () => {
    mockFetch({ data: { items: [{ id: 1 }] } });
    const result = await graphqlApi.query({ query: QUERY, dataKey: "items" });
    expect(result).toEqual([{ id: 1 }]);
  });

  it("sends POST with correct Content-Type header", async () => {
    mockFetch({ data: { x: 1 } });
    await graphqlApi.query({ query: QUERY });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.method).toBe("POST");
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  it("sends Authorization header when GRAPHQL_TOKEN is set", async () => {
    vi.stubEnv("GRAPHQL_TOKEN", "test-token");
    vi.resetModules();
    const { default: api } = await import("./graphqlApi");
    mockFetch({ data: { x: 1 } });
    await api.query({ query: QUERY });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers["Authorization"]).toBe("Bearer test-token");
    vi.resetModules();
  });

  it("forwards next revalidate options to fetch", async () => {
    mockFetch({ data: { x: 1 } });
    await graphqlApi.query({ query: QUERY, next: { revalidate: 300, tags: ["cv"] } });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.next).toEqual({ revalidate: 300, tags: ["cv"] });
  });
});

describe("graphqlApi.query — mock fallback", () => {
  it("falls back to mock on network error", async () => {
    mockFetchThrow();
    const result = await graphqlApi.query({ query: QUERY, mock: "cv-contact" });
    expect(result).toBeDefined();
  });

  it("falls back to mock when fetch response is not ok", async () => {
    mockFetch({ data: null }, false);
    const result = await graphqlApi.query({ query: QUERY, mock: "cv-contact" });
    expect(result).toBeDefined();
  });

  it("falls back to mock when data is an empty array", async () => {
    mockFetch({ data: { items: [] } });
    const result = await graphqlApi.query({ query: QUERY, dataKey: "items", mock: "cv-contact" });
    expect(result).toBeDefined();
  });

  it("falls back to mock when GraphQL returns errors", async () => {
    mockFetch({ data: null, errors: [{ message: "Not found" }] });
    const result = await graphqlApi.query({ query: QUERY, mock: "cv-contact" });
    expect(result).toBeDefined();
  });
});

describe("graphqlApi.query — error paths", () => {
  it("throws on network error when no mock provided", async () => {
    mockFetchThrow(new Error("Network error"));
    await expect(graphqlApi.query({ query: QUERY })).rejects.toThrow("Network error");
  });

  it("throws GraphQL error messages when no mock provided", async () => {
    mockFetch({ data: null, errors: [{ message: "Unauthorized" }, { message: "Not found" }] });
    await expect(graphqlApi.query({ query: QUERY })).rejects.toThrow("Unauthorized; Not found");
  });

  it("throws when mock key does not exist in MockView", async () => {
    mockFetchThrow();
    await expect(graphqlApi.query({ query: QUERY, mock: "nonexistent-mock" })).rejects.toThrow();
  });

  it("throws when res.ok is true but data is null and no mock provided", async () => {
    mockFetch({ data: null });
    await expect(graphqlApi.query({ query: QUERY })).rejects.toThrow();
  });

  it("throws when dataKey resolves to null and no mock provided", async () => {
    mockFetch({ data: { items: null } });
    await expect(graphqlApi.query({ query: QUERY, dataKey: "items" })).rejects.toThrow();
  });
});

describe("graphqlApi.query — request options", () => {
  it("serializes variables into the request body", async () => {
    mockFetch({ data: { x: 1 } });
    const variables = { id: 42, name: "test" };
    await graphqlApi.query({ query: QUERY, variables });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(JSON.parse(init.body)).toMatchObject({ query: QUERY, variables });
  });

  it("uses custom url when provided", async () => {
    mockFetch({ data: { x: 1 } });
    const customUrl = "https://custom.api/graphql";
    await graphqlApi.query({ query: QUERY, url: customUrl });
    const [url] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe(customUrl);
  });

  it("forwards cache option to fetch", async () => {
    mockFetch({ data: { x: 1 } });
    await graphqlApi.query({ query: QUERY, cache: "no-store" });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.cache).toBe("no-store");
  });

  it("sends Authorization header when STRAPI_API_TOKEN is set and GRAPHQL_TOKEN is absent", async () => {
    vi.stubEnv("STRAPI_API_TOKEN", "strapi-token");
    vi.resetModules();
    const { default: api } = await import("./graphqlApi");
    mockFetch({ data: { x: 1 } });
    await api.query({ query: QUERY });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers["Authorization"]).toBe("Bearer strapi-token");
    vi.resetModules();
  });
});

describe("graphqlApi.query — mock not triggered", () => {
  it("returns live data when res.ok is true and mock is provided but data is non-empty", async () => {
    mockFetch({ data: { items: [{ id: 99 }] } });
    const result = await graphqlApi.query({ query: QUERY, dataKey: "items", mock: "cv-contact" });
    expect(result).toEqual([{ id: 99 }]);
  });
});
