import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useParams: vi.fn(),
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

import { useParams, usePathname, useRouter } from "next/navigation";
import { useLocale } from "./useLocale";

describe("useLocale", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useParams).mockReturnValue({ locale: "en" } as ReturnType<typeof useParams>);
    vi.mocked(usePathname).mockReturnValue("/en/home");
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as unknown as ReturnType<typeof useRouter>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the locale from route params", () => {
    const { result } = renderHook(() => useLocale());
    expect(result.current.locale).toBe("en");
  });

  it("falls back to defaultLocale ('en') when locale param is absent", () => {
    vi.mocked(useParams).mockReturnValue({} as ReturnType<typeof useParams>);
    const { result } = renderHook(() => useLocale());
    expect(result.current.locale).toBe("en");
  });

  it("returns a setLocale function", () => {
    const { result } = renderHook(() => useLocale());
    expect(typeof result.current.setLocale).toBe("function");
  });

  it("setLocale sets NEXT_LOCALE cookie", () => {
    const cookieSpy = vi.spyOn(document, "cookie", "set");
    const { result } = renderHook(() => useLocale());
    act(() => {
      result.current.setLocale("vi");
    });
    expect(cookieSpy).toHaveBeenCalledWith(expect.stringContaining("NEXT_LOCALE=vi"));
  });

  it("setLocale replaces locale segment in path and navigates", () => {
    vi.mocked(usePathname).mockReturnValue("/en/projects");
    const { result } = renderHook(() => useLocale());
    act(() => {
      result.current.setLocale("vi");
    });
    expect(mockPush).toHaveBeenCalledWith("/vi/projects");
  });

  it("setLocale handles root locale path correctly", () => {
    vi.mocked(usePathname).mockReturnValue("/en");
    const { result } = renderHook(() => useLocale());
    act(() => {
      result.current.setLocale("vi");
    });
    expect(mockPush).toHaveBeenCalledWith("/vi");
  });

  it("setLocale handles nested paths correctly", () => {
    vi.mocked(usePathname).mockReturnValue("/en/blog/post-1");
    const { result } = renderHook(() => useLocale());
    act(() => {
      result.current.setLocale("vi");
    });
    expect(mockPush).toHaveBeenCalledWith("/vi/blog/post-1");
  });

  it("setLocale is stable across re-renders (memoized)", () => {
    const { result, rerender } = renderHook(() => useLocale());
    const firstSetLocale = result.current.setLocale;
    rerender();
    expect(result.current.setLocale).toBe(firstSetLocale);
  });
});
