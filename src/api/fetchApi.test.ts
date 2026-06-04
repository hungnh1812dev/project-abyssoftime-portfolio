import { afterEach, describe, expect, it, vi } from "vitest";
import fetchApi from "./fetchApi";

const URL = "https://api.example.com/data";

function mockFetch(payload: unknown, ok = true) {
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
});

describe("fetchApi.get — success paths", () => {
  it("returns parsed JSON on ok response", async () => {
    mockFetch({ id: 1, name: "test" });
    const result = await fetchApi.get(URL);
    expect(result).toEqual({ id: 1, name: "test" });
  });

  it("sends GET method", async () => {
    mockFetch({});
    await fetchApi.get(URL);
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.method).toBe("GET");
  });

  it("passes custom headers through to fetch", async () => {
    mockFetch({});
    await fetchApi.get(URL, { headers: { Authorization: "Bearer token" } });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect((init.headers as Record<string, string>)["Authorization"]).toBe("Bearer token");
  });

  it("passes the correct url to fetch", async () => {
    mockFetch({});
    await fetchApi.get(URL);
    const [calledUrl] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(calledUrl).toBe(URL);
  });

  it("passes extra RequestInit options (e.g. cache) through to fetch", async () => {
    mockFetch({});
    await fetchApi.get(URL, { cache: "no-store" });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.cache).toBe("no-store");
  });
});

describe("fetchApi.get — mock fallback", () => {
  it("falls back to mock on network error", async () => {
    mockFetchThrow();
    const result = await fetchApi.get(URL, { mock: "cv-contact" });
    expect(result).toBeDefined();
  });

  it("falls back to mock when response is not ok", async () => {
    mockFetch(null, false);
    const result = await fetchApi.get(URL, { mock: "cv-contact" });
    expect(result).toBeDefined();
  });
});

describe("fetchApi.get — error paths", () => {
  it("throws generic error on network error when no mock provided", async () => {
    mockFetchThrow(new Error("Network error"));
    await expect(fetchApi.get(URL)).rejects.toThrow(`Request failed for: ${URL}`);
  });

  it("throws when response is not ok and no mock provided", async () => {
    mockFetch(null, false);
    await expect(fetchApi.get(URL)).rejects.toThrow(`Request failed for: ${URL}`);
  });

  it("throws when mock key does not exist in MockView", async () => {
    mockFetchThrow();
    await expect(fetchApi.get(URL, { mock: "nonexistent-mock" })).rejects.toThrow();
  });
});
