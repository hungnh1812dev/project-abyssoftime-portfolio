import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { PageEmptyState } from "./PageEmptyState";

describe("PageEmptyState", () => {
  const mockReload = vi.fn();

  beforeEach(() => {
    vi.stubGlobal("location", { ...window.location, reload: mockReload });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    expect(() => render(<PageEmptyState />)).not.toThrow();
  });

  it("renders the skeleton section with aria-hidden", () => {
    const { container } = render(<PageEmptyState />);
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("shows the 'Content is temporarily unavailable.' message", () => {
    render(<PageEmptyState />);
    expect(screen.getByText(/content is temporarily unavailable/i)).toBeInTheDocument();
  });

  it("renders a reload button", () => {
    render(<PageEmptyState />);
    expect(screen.getByRole("button", { name: /reload page/i })).toBeInTheDocument();
  });

  it("renders the notice with role='alert'", () => {
    render(<PageEmptyState />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("calls window.location.reload when the reload button is clicked", async () => {
    const user = userEvent.setup();
    render(<PageEmptyState />);
    await user.click(screen.getByRole("button", { name: /reload page/i }));
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it("does not call reload before user interaction", () => {
    render(<PageEmptyState />);
    expect(mockReload).not.toHaveBeenCalled();
  });

  it("renders 4 skeleton grid placeholder cards", () => {
    const { container } = render(<PageEmptyState />);
    const skeleton = container.querySelector("[aria-hidden='true']");
    expect(skeleton?.querySelectorAll(".h-20")).toHaveLength(4);
  });

  it("calls reload once per click across multiple interactions", async () => {
    const user = userEvent.setup();
    render(<PageEmptyState />);
    const btn = screen.getByRole("button", { name: /reload page/i });
    await user.click(btn);
    await user.click(btn);
    expect(mockReload).toHaveBeenCalledTimes(2);
  });
});
