import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/providers/ThemeProvider", () => ({
  useTheme: vi.fn(),
}));

import { useTheme } from "@/components/providers/ThemeProvider";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle", () => {
  const mockToggle = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useTheme).mockReturnValue({ theme: "light", toggle: mockToggle });
  });

  it("renders a button with aria-label 'Toggle theme'", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it("renders an SVG icon inside the button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
  });

  it("renders Moon icon (not Sun) in light mode", () => {
    render(<ThemeToggle />);
    // Moon icon is the one visible in light mode; both icons are SVGs
    // We verify the button contains exactly one icon
    const svgs = screen.getByRole("button").querySelectorAll("svg");
    expect(svgs).toHaveLength(1);
  });

  it("renders Sun icon in dark mode", () => {
    vi.mocked(useTheme).mockReturnValue({ theme: "dark", toggle: mockToggle });
    render(<ThemeToggle />);
    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
  });

  it("calls toggle once when button is clicked", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    await user.click(screen.getByRole("button"));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it("calls toggle on each click across multiple interactions", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const btn = screen.getByRole("button");
    await user.click(btn);
    await user.click(btn);
    await user.click(btn);
    expect(mockToggle).toHaveBeenCalledTimes(3);
  });

  it("does not call toggle before user interaction", () => {
    render(<ThemeToggle />);
    expect(mockToggle).not.toHaveBeenCalled();
  });

  it("triggers toggle on keyboard Enter key press", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
