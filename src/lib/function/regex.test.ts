import { describe, expect, it } from "vitest";
import { createRegex } from "./regex";

describe("createRegex", () => {
  it("returns an object with a test method", () => {
    const regex = createRegex("hello");
    expect(typeof regex.test).toBe("function");
  });

  it("matches a simple string pattern", () => {
    expect(createRegex("hello").test("hello world")).toBe(true);
  });

  it("does not match when pattern is absent in the string", () => {
    expect(createRegex("hello").test("world")).toBe(false);
  });

  it("matches locale segment at end of path", () => {
    const regex = createRegex("(\\/en$)");
    expect(regex.test("/en")).toBe(true);
    expect(regex.test("/vi")).toBe(false);
    expect(regex.test("/en/about")).toBe(false);
  });

  it("matches locale segment at start of path", () => {
    const regex = createRegex("(^\\/en\\/)");
    expect(regex.test("/en/about")).toBe(true);
    expect(regex.test("/vi/about")).toBe(false);
  });

  it("matches bare locale segment without leading slash", () => {
    const regex = createRegex("(^en\\/)");
    expect(regex.test("en/about")).toBe(true);
    expect(regex.test("vi/about")).toBe(false);
  });

  it("supports alternation — matches any of the branches", () => {
    const regex = createRegex("(\\/en$)|(^\\/en\\/)|(^en\\/)");
    expect(regex.test("/en")).toBe(true);
    expect(regex.test("/en/about")).toBe(true);
    expect(regex.test("en/about")).toBe(true);
    expect(regex.test("/vi")).toBe(false);
    expect(regex.test("/vi/about")).toBe(false);
  });

  it("handles empty pattern (matches every string)", () => {
    const regex = createRegex("");
    expect(regex.test("anything")).toBe(true);
    expect(regex.test("")).toBe(true);
  });
});
