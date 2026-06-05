import { afterEach, describe, expect, it, vi } from "vitest";
import restfulApi, { type ApiError } from "./restfulApi";

const URL = "https://api.example.com/data";

function mockFetch(payload: unknown, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
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

// ─── GET ──────────────────────────────────────────────────────────────────────

describe("restfulApi.fetch GET — success paths", () => {
  it("returns parsed JSON on ok response", async () => {
    mockFetch({ id: 1, name: "test" });
    const result = await restfulApi.fetch({ url: URL });
    expect(result).toEqual({ id: 1, name: "test" });
  });

  it("defaults to GET method", async () => {
    mockFetch({});
    await restfulApi.fetch({ url: URL });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.method).toBe("GET");
  });

  it("passes the correct url to fetch", async () => {
    mockFetch({});
    await restfulApi.fetch({ url: URL });
    const [calledUrl] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(calledUrl).toBe(URL);
  });

  it("passes custom headers through to fetch", async () => {
    mockFetch({});
    await restfulApi.fetch({
      url: URL,
      headers: { Authorization: "Bearer token" },
    });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect((init.headers as Record<string, string>)["Authorization"]).toBe(
      "Bearer token",
    );
  });

  it("passes cache option through to fetch", async () => {
    mockFetch({});
    await restfulApi.fetch({ url: URL, cache: "no-store" });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.cache).toBe("no-store");
  });

  it("passes next revalidate options through to fetch", async () => {
    mockFetch({});
    await restfulApi.fetch({
      url: URL,
      next: { revalidate: 60, tags: ["tag1"] },
    });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.next).toEqual({ revalidate: 60, tags: ["tag1"] });
  });

  it("extracts selectKey from JSON response", async () => {
    mockFetch({ items: [{ id: 1 }], total: 10 });
    const result = await restfulApi.fetch({ url: URL, selectKey: "items" });
    expect(result).toEqual([{ id: 1 }]);
  });
});

// ─── POST ─────────────────────────────────────────────────────────────────────

describe("restfulApi.fetch POST — success paths", () => {
  it("sends method POST", async () => {
    mockFetch({ ok: true });
    await restfulApi.fetch({ url: URL, method: "POST", body: { name: "x" } });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.method).toBe("POST");
  });

  it("serializes body to JSON string", async () => {
    mockFetch({ ok: true });
    const body = { name: "test", value: 42 };
    await restfulApi.fetch({ url: URL, method: "POST", body });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(JSON.parse(init.body as string)).toEqual(body);
  });

  it("sets Content-Type application/json when body is present", async () => {
    mockFetch({ ok: true });
    await restfulApi.fetch({ url: URL, method: "POST", body: {} });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers["Content-Type"]).toBe("application/json");
  });

  it("merges caller headers with Content-Type", async () => {
    mockFetch({ ok: true });
    await restfulApi.fetch({
      url: URL,
      method: "POST",
      body: {},
      headers: { "X-Custom": "value" },
    });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(init.headers["X-Custom"]).toBe("value");
  });
});

// ─── PUT ──────────────────────────────────────────────────────────────────────

describe("restfulApi.fetch PUT — success paths", () => {
  it("sends method PUT", async () => {
    mockFetch({ updated: true });
    await restfulApi.fetch({
      url: URL,
      method: "PUT",
      body: { name: "updated" },
    });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.method).toBe("PUT");
  });

  it("serializes body for PUT", async () => {
    mockFetch({ updated: true });
    const body = { name: "updated" };
    await restfulApi.fetch({ url: URL, method: "PUT", body });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(JSON.parse(init.body as string)).toEqual(body);
  });
});

// ─── DELETE ───────────────────────────────────────────────────────────────────

describe("restfulApi.fetch DELETE — success paths", () => {
  it("sends method DELETE", async () => {
    mockFetch({});
    await restfulApi.fetch({ url: URL, method: "DELETE" });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.method).toBe("DELETE");
  });

  it("does not send body for DELETE", async () => {
    mockFetch({});
    await restfulApi.fetch({ url: URL, method: "DELETE" });
    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(init.body).toBeUndefined();
  });
});

// ─── Mock fallback ────────────────────────────────────────────────────────────

describe("restfulApi.fetch — mock fallback", () => {
  it("falls back to mock on network error", async () => {
    mockFetchThrow();
    const result = await restfulApi.fetch({ url: URL, mock: "cv-contact" });
    expect(result).toBeDefined();
  });

  it("does NOT fall back to mock on HTTP error (4xx/5xx)", async () => {
    mockFetch(null, false);
    await expect(
      restfulApi.fetch({ url: URL, mock: "cv-contact" }),
    ).rejects.toThrow("HTTP 500");
  });
});

// ─── Error paths ──────────────────────────────────────────────────────────────

describe("restfulApi.fetch — error paths", () => {
  it("throws on network error when no mock provided", async () => {
    mockFetchThrow(new Error("Network error"));
    await expect(restfulApi.fetch({ url: URL })).rejects.toThrow(
      "Network error",
    );
  });

  it("throws ApiError with status on non-ok response", async () => {
    mockFetch({ error: "Not Found" }, false);
    const err = (await restfulApi.fetch({ url: URL }).catch((e) => e)) as ApiError;
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(500);
    expect(err.message).toContain("HTTP 500");
  });

  it("attaches info (parsed body) to ApiError on non-ok response", async () => {
    mockFetch({ error: "Not Found" }, false);
    const err = (await restfulApi.fetch({ url: URL }).catch((e) => e)) as ApiError;
    expect(err.info).toEqual({ error: "Not Found" });
  });

  it("throws when mock key does not exist in MockView", async () => {
    mockFetchThrow();
    await expect(
      restfulApi.fetch({ url: URL, mock: "nonexistent-mock" }),
    ).rejects.toThrow();
  });
});
