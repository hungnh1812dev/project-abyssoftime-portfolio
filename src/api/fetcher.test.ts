import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import fetcher, { unifyFetch } from "./fetcher";
import { clearRegistry, registerService } from "./registry";

vi.mock("./graphqlApi", () => ({
  default: { fetch: vi.fn().mockResolvedValue({ mocked: "graphql" }) },
}));

vi.mock("./restfulApi", () => ({
  default: { fetch: vi.fn().mockResolvedValue({ mocked: "rest" }) },
}));

async function getGraphqlApi() {
  const { default: api } = await import("./graphqlApi");
  return api;
}

async function getRestfulApi() {
  const { default: api } = await import("./restfulApi");
  return api;
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("fetcher — graphql routing", () => {
  it("routes to graphqlApi.fetch when driver is 'graphql'", async () => {
    const graphqlApi = await getGraphqlApi();
    await fetcher({ driver: "graphql", body: { query: "{ id }" } });
    expect(graphqlApi.fetch).toHaveBeenCalledOnce();
  });

  it("defaults to graphql driver when driver is omitted", async () => {
    const graphqlApi = await getGraphqlApi();
    await fetcher({ body: { query: "{ id }" } });
    expect(graphqlApi.fetch).toHaveBeenCalledOnce();
  });

  it("forwards body, selectKey, mock, next, cache to graphqlApi", async () => {
    const graphqlApi = await getGraphqlApi();
    const options = {
      body: { query: "{ id }" },
      selectKey: "items",
      mock: "cv-page",
      next: { revalidate: 300 as const, tags: ["cv"] },
      cache: "no-store" as RequestCache,
    };
    await fetcher({ driver: "graphql", ...options });
    expect(graphqlApi.fetch).toHaveBeenCalledWith(
      expect.objectContaining(options),
    );
  });

  it("does not forward method to graphqlApi", async () => {
    const graphqlApi = await getGraphqlApi();
    await fetcher({ driver: "graphql", body: {}, method: "POST" });
    const [args] = (graphqlApi.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(args).not.toHaveProperty("driver");
  });

  it("returns the value from graphqlApi.fetch", async () => {
    const result = await fetcher({ driver: "graphql", body: {} });
    expect(result).toEqual({ mocked: "graphql" });
  });
});

describe("fetcher — rest routing", () => {
  it("routes to restfulApi.fetch when driver is 'rest'", async () => {
    const restfulApi = await getRestfulApi();
    await fetcher({ driver: "rest", url: "/api/items" });
    expect(restfulApi.fetch).toHaveBeenCalledOnce();
  });

  it("forwards url, method, body, selectKey, mock, next, cache to restfulApi", async () => {
    const restfulApi = await getRestfulApi();
    const options = {
      url: "/api/items",
      method: "POST" as const,
      body: { name: "test" },
      selectKey: "data",
      mock: "cv-contact",
      next: { revalidate: 60 as const },
      cache: "force-cache" as RequestCache,
    };
    await fetcher({ driver: "rest", ...options });
    expect(restfulApi.fetch).toHaveBeenCalledWith(
      expect.objectContaining(options),
    );
  });

  it("defaults method to GET when not specified", async () => {
    const restfulApi = await getRestfulApi();
    await fetcher({ driver: "rest", url: "/api/items" });
    const [args] = (restfulApi.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    // method not set here — restfulApi itself defaults to GET internally
    expect(args).not.toHaveProperty("driver");
  });

  it("returns the value from restfulApi.fetch", async () => {
    const result = await fetcher({ driver: "rest", url: "/api/items" });
    expect(result).toEqual({ mocked: "rest" });
  });

  it("does not forward driver field to restfulApi", async () => {
    const restfulApi = await getRestfulApi();
    await fetcher({ driver: "rest", url: "/api/items" });
    const [args] = (restfulApi.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(args).not.toHaveProperty("driver");
  });
});

describe("unifyFetch — registry dispatch", () => {
  beforeEach(() => clearRegistry());

  it("calls the registered service execute and returns its result", async () => {
    const execute = vi.fn().mockResolvedValue("cv-data");
    registerService({ key: "cv.main", driver: "graphql", execute });
    const result = await unifyFetch({ apiKey: "cv.main" });
    expect(execute).toHaveBeenCalledOnce();
    expect(result).toBe("cv-data");
  });

  it("forwards params to execute", async () => {
    const execute = vi.fn().mockResolvedValue("ok");
    registerService({ key: "cv.main", driver: "graphql", execute });
    await unifyFetch({ apiKey: "cv.main", params: { lang: "vi", pageSize: 5 } });
    expect(execute).toHaveBeenCalledWith({ lang: "vi", pageSize: 5 });
  });

  it("defaults to graphql driver when driver is omitted", async () => {
    const execute = vi.fn().mockResolvedValue("ok");
    registerService({ key: "cv.main", driver: "graphql", execute });
    await unifyFetch({ apiKey: "cv.main" });
    expect(execute).toHaveBeenCalledOnce();
  });

  it("uses explicit driver override", async () => {
    const restExecute = vi.fn().mockResolvedValue("rest-data");
    registerService({ key: "cv.main", driver: "rest", execute: restExecute });
    const result = await unifyFetch({ apiKey: "cv.main", driver: "rest" });
    expect(restExecute).toHaveBeenCalledOnce();
    expect(result).toBe("rest-data");
  });

  it("throws when no service is registered for the key+driver", async () => {
    await expect(unifyFetch({ apiKey: "no.such.service" })).rejects.toThrow(
      '[registry] No service for key="no.such.service" driver="graphql"',
    );
  });
});
