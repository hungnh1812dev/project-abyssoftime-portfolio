import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeProvider";

function ThemeConsumer() {
  const { theme, toggle } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}

describe("ThemeProvider", () => {
  beforeEach(() => {
    document.documentElement.classList.remove("dark");
    vi.spyOn(Storage.prototype, "setItem");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.classList.remove("dark");
  });

  it("renders children", () => {
    render(
      <ThemeProvider>
        <span>child content</span>
      </ThemeProvider>,
    );
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("provides 'light' theme by default", () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
  });

  it("provides 'dark' theme when html element already has dark class", () => {
    document.documentElement.classList.add("dark");
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
  });

  it("toggle() adds dark class to html element and saves to localStorage", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  it("toggle() removes dark class and saves 'light' to localStorage when already dark", async () => {
    document.documentElement.classList.add("dark");
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "light");
  });

  it("toggle() cycles correctly on consecutive clicks", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>,
    );
    const btn = screen.getByRole("button", { name: "Toggle" });
    await user.click(btn); // light → dark
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    await user.click(btn); // dark → light
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});

describe("useTheme (default context — outside ThemeProvider)", () => {
  it("returns 'light' as the default theme", () => {
    function NakedConsumer() {
      const { theme } = useTheme();
      return <span>{theme}</span>;
    }
    render(<NakedConsumer />);
    expect(screen.getByText("light")).toBeInTheDocument();
  });

  it("default toggle is a no-op and does not throw", () => {
    function NakedToggler() {
      const { toggle } = useTheme();
      return <button onClick={toggle}>Go</button>;
    }
    render(<NakedToggler />);
    expect(() => screen.getByRole("button").click()).not.toThrow();
  });
});
