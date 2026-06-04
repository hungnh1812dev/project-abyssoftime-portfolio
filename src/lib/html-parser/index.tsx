import parse from "html-react-parser";
import DOMPurify from "isomorphic-dompurify";

interface HTMLParserProps {
  content: string;
  component?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

export const HTMLParser = ({ content, component = "div", className }: HTMLParserProps) => {
  const Comp = component;
  if (!content) return null;
  const clean = DOMPurify.sanitize(content);
  return <Comp className={className}>{parse(clean)}</Comp>;
};
