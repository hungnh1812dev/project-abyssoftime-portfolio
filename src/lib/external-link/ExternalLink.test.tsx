import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/hooks/useLocale", () => ({
  useLocale: () => ({ locale: "en", setLocale: vi.fn() }),
}));

// Render Next Link as a plain anchor so href/target are inspectable
vi.mock("next/link", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  default: ({ href, children, target, rel, passHref: _, ...props }: any) => (
    <a href={String(href)} target={target} rel={rel} {...props}>
      {children}
    </a>
  ),
}));

import ExternalLink from "./ExternalLink";

describe("ExternalLink — internal relative URLs", () => {
  it("renders children", () => {
    render(<ExternalLink href="/home">Home</ExternalLink>);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("prepends locale to relative URL with leading slash", () => {
    render(<ExternalLink href="/about">About</ExternalLink>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/en/about");
  });

  it("prepends locale to bare relative path without leading slash", () => {
    render(<ExternalLink href="about">About</ExternalLink>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/en/about");
  });

  it("does not double-add locale when URL already has locale prefix", () => {
    render(<ExternalLink href="/en/about">About</ExternalLink>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/en/about");
  });

  it("does not add locale to vi-prefixed URL", () => {
    render(<ExternalLink href="/vi/about">About</ExternalLink>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/vi/about");
  });

  it("uses _self as default target for internal links", () => {
    render(<ExternalLink href="/contact">Contact</ExternalLink>);
    expect(screen.getByRole("link")).toHaveAttribute("target", "_self");
  });

  it("passes className to the rendered element", () => {
    render(<ExternalLink href="/home" className="my-class">Home</ExternalLink>);
    expect(screen.getByRole("link")).toHaveClass("my-class");
  });
});

describe("ExternalLink — absolute external URLs", () => {
  it("renders https URL as plain anchor with _blank target", () => {
    render(<ExternalLink href="https://example.com">Link</ExternalLink>);
    const link = screen.getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders http URL as plain anchor with _blank target", () => {
    render(<ExternalLink href="http://example.com">Link</ExternalLink>);
    expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
  });

  it("renders mailto: URL as external link", () => {
    render(<ExternalLink href="mailto:test@example.com">Email</ExternalLink>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "mailto:test@example.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders tel: URL as external link", () => {
    render(<ExternalLink href="tel:+84123456789">Call</ExternalLink>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "tel:+84123456789");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("respects a custom target override for external URLs", () => {
    render(<ExternalLink href="https://example.com" target="_self">Link</ExternalLink>);
    expect(screen.getByRole("link")).toHaveAttribute("target", "_self");
  });
});

describe("ExternalLink — same-domain detection", () => {
  it("treats vercel app domain as same domain and uses _self target", () => {
    render(
      <ExternalLink href="https://project-abyssoftime-portfolio.vercel.app/en/about">
        Link
      </ExternalLink>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("target", "_self");
  });
});

describe("ExternalLink — forwarded ref", () => {
  it("has a displayName of ExternalLink", async () => {
    const { default: ExternalLinkModule } = await import("./ExternalLink");
    expect(ExternalLinkModule.displayName).toBe("ExternalLink");
  });
});
