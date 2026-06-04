import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrintButton } from "./PrintButton";

describe("PrintButton", () => {
  beforeEach(() => {
    vi.stubGlobal("print", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders a button with text 'Print / Save PDF'", () => {
    render(<PrintButton />);
    expect(screen.getByRole("button", { name: /print \/ save pdf/i })).toBeInTheDocument();
  });

  it("calls window.print() when clicked", async () => {
    const user = userEvent.setup();
    render(<PrintButton />);
    await user.click(screen.getByRole("button", { name: /print \/ save pdf/i }));
    expect(window.print).toHaveBeenCalledTimes(1);
  });

  it("applies the optional className prop to the button", () => {
    render(<PrintButton className="my-custom-class" />);
    expect(screen.getByRole("button")).toHaveClass("my-custom-class");
  });

  it("does not call window.print() before user interaction", () => {
    render(<PrintButton />);
    expect(window.print).not.toHaveBeenCalled();
  });

  it("renders without className prop without error", () => {
    expect(() => render(<PrintButton />)).not.toThrow();
  });
});
