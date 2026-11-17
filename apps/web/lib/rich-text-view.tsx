import { Fragment } from "react";
import { parseRichText, type RichInline } from "./rich-text";

function Inline({ parts }: { parts: RichInline[] }) {
  return (
    <>
      {parts.map((part, i) => {
        if (part.type === "strong") return <strong key={i}>{part.text}</strong>;
        if (part.type === "link") {
          return (
            <a key={i} href={part.href} target="_blank" rel="noopener noreferrer">
              {part.text}
            </a>
          );
        }
        return <Fragment key={i}>{part.text}</Fragment>;
      })}
    </>
  );
}

/**
 * Safe renderer for CMS long text (article body, About, programme, event…).
 * Use this instead of `dangerouslySetInnerHTML` — see ./rich-text.ts.
 */
export function RichText({ text, className }: { text: string | null | undefined; className?: string }) {
  const blocks = parseRichText(text);
  if (blocks.length === 0) return null;
  return (
    <div className={className}>
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          const Tag = block.level === 2 ? "h2" : "h3";
          return (
            <Tag key={i}>
              <Inline parts={block.content} />
            </Tag>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={i}>
              {block.items.map((item, j) => (
                <li key={j}>
                  <Inline parts={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {block.lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 ? <br /> : null}
                <Inline parts={line} />
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
