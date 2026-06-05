import parse from "html-react-parser";
import sanitizeHtml from "sanitize-html";

interface HTMLParserProps {
  content: string;
  component?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

export const HTMLParser = ({ content, component = "div", className }: HTMLParserProps) => {
  const Comp = component;
  if (!content) return null;
  const clean = sanitizeHtml(content);
  return <Comp className={className}>{parse(clean)}</Comp>;
};
