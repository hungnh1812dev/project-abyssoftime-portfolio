import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HTMLParser } from "./index";

describe("HTMLParser", () => {
  it("returns null for empty string", () => {
    const { container } = render(<HTMLParser content="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders plain text content", () => {
    render(<HTMLParser content="Hello world" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders HTML tags from content string", () => {
    const { container } = render(<HTMLParser content="<p>Paragraph</p>" />);
    expect(container.querySelector("p")).toBeInTheDocument();
    expect(container.querySelector("p")?.textContent).toBe("Paragraph");
  });

  it("strips XSS script tags", () => {
    const { container } = render(<HTMLParser content='<script>alert("xss")</script><p>safe</p>' />);
    expect(container.querySelector("script")).toBeNull();
    expect(container.querySelector("p")?.textContent).toBe("safe");
  });

  it("strips dangerous event handler attributes", () => {
    const { container } = render(<HTMLParser content='<img src="x" onerror="alert(1)" />' />);
    const img = container.querySelector("img");
    expect(img?.getAttribute("onerror")).toBeNull();
  });

  it("wraps content in default div element", () => {
    const { container } = render(<HTMLParser content="<p>text</p>" />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("wraps content in custom element when component prop is set", () => {
    const { container } = render(<HTMLParser content="<p>text</p>" component="section" />);
    expect(container.firstChild?.nodeName).toBe("SECTION");
  });

  it("applies className to wrapper element", () => {
    const { container } = render(<HTMLParser content="<p>text</p>" className="prose" />);
    expect((container.firstChild as HTMLElement).className).toBe("prose");
  });

  it("preserves nested HTML structure", () => {
    const { container } = render(
      <HTMLParser content="<ul><li>item 1</li><li>item 2</li></ul>" />,
    );
    expect(container.querySelectorAll("li")).toHaveLength(2);
    expect(container.querySelector("ul")).toBeInTheDocument();
  });

  it("keeps safe anchor links intact", () => {
    const { container } = render(
      <HTMLParser content='<a href="https://example.com">link</a>' />,
    );
    const anchor = container.querySelector("a");
    expect(anchor).toBeInTheDocument();
    expect(anchor?.getAttribute("href")).toBe("https://example.com");
  });

  it("strips javascript: href from anchor tags", () => {
    const { container } = render(
      <HTMLParser content='<a href="javascript:alert(1)">click</a>' />,
    );
    const anchor = container.querySelector("a");
    // DOMPurify removes the href entirely — null or empty string, never "javascript:"
    const href = anchor?.getAttribute("href") ?? "";
    expect(href).not.toMatch(/^javascript:/i);
  });

  it("renders HTML entities correctly", () => {
    render(<HTMLParser content="<p>&amp; &lt; &gt;</p>" />);
    expect(screen.getByText("& < >")).toBeInTheDocument();
  });
});
