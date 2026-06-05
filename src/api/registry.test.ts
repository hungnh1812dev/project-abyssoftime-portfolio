import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearRegistry, lookupService, registerService } from "./registry";

beforeEach(() => clearRegistry());

describe("registerService / lookupService", () => {
  it("registers and retrieves a service by apiKey + driver", async () => {
    const execute = vi.fn().mockResolvedValue("data");
    registerService({ key: "test.svc", driver: "graphql", execute });
    const svc = lookupService("test.svc", "graphql");
    expect(await svc.execute()).toBe("data");
  });

  it("forwards params to execute", async () => {
    const execute = vi.fn().mockResolvedValue("data");
    registerService({ key: "test.svc", driver: "graphql", execute });
    const svc = lookupService("test.svc", "graphql");
    await svc.execute({ lang: "en", pageSize: 10 });
    expect(execute).toHaveBeenCalledWith({ lang: "en", pageSize: 10 });
  });

  it("throws when service is not registered", () => {
    expect(() => lookupService("not.exists", "graphql")).toThrow(
      '[registry] No service for key="not.exists" driver="graphql"',
    );
  });

  it("distinguishes by driver — same key different drivers are separate", async () => {
    const gql = vi.fn().mockResolvedValue("graphql-data");
    const rest = vi.fn().mockResolvedValue("rest-data");
    registerService({ key: "test.svc", driver: "graphql", execute: gql });
    registerService({ key: "test.svc", driver: "rest", execute: rest });
    expect(await lookupService("test.svc", "graphql").execute()).toBe(
      "graphql-data",
    );
    expect(await lookupService("test.svc", "rest").execute()).toBe("rest-data");
  });

  it("overwrites previous registration for the same key+driver", async () => {
    const first = vi.fn().mockResolvedValue("first");
    const second = vi.fn().mockResolvedValue("second");
    registerService({ key: "test.svc", driver: "graphql", execute: first });
    registerService({ key: "test.svc", driver: "graphql", execute: second });
    expect(await lookupService("test.svc", "graphql").execute()).toBe("second");
  });
});
