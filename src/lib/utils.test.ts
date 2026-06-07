import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("returns empty string with no arguments", () => {
    expect(cn()).toBe("");
  });

  it("joins multiple class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("resolves tailwind conflicting classes — last value wins", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", "text-lg")).toBe("text-lg");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("filters out falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("handles conditional object syntax", () => {
    expect(cn({ active: true, disabled: false, visible: true })).toBe("active visible");
  });

  it("handles array syntax", () => {
    expect(cn(["a", "b"])).toBe("a b");
  });

  it("merges mixed inputs correctly", () => {
    expect(cn("base", { extra: true }, ["arr"])).toBe("base extra arr");
  });

  it("handles empty string inputs", () => {
    expect(cn("", "a", "")).toBe("a");
  });

  it("deduplicates same tailwind utilities via twMerge", () => {
    expect(cn("p-2", "p-2")).toBe("p-2");
  });
});
