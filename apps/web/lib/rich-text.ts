import { z } from "zod";

/**
 * "Rich text" in this CMS is plain text with a few light conventions — never
 * HTML (AD-B9-02). Storage: `sanitizeRichText` strips any markup that got
 * pasted or posted. Display: `parseRichText` turns the text into blocks that
 * `<RichText>` renders as React elements, so nothing is ever injected as HTML.
 *
 *   blank line      → new paragraph
 *   "- " / "* "     → bullet list item
 *   "## " / "### "  → heading
 *   **bold**        → strong
 *   https://…       → link (http/https only)
 */

/** Field hint for long-text inputs in admin forms. */
export const RICH_TEXT_HINT =
  "Blank line = new paragraph · start a line with “- ” for a list or “## ” for a heading · **bold** · web links become clickable.";

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const SCRIPT_LIKE = /<(script|style|iframe|object|embed|template)\b[\s\S]*?<\/\1\s*>/gi;
const BLOCK_END = /<\/(p|div|h[1-6]|tr|blockquote|ul|ol)\s*>|<br\s*\/?>/gi;
const TAG = /<\/?[a-zA-Z][^>]*>/g;

export function sanitizeRichText(input: string): string {
  return input
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(SCRIPT_LIKE, "")
    .replace(/<li\b[^>]*>/gi, "\n- ")
    .replace(BLOCK_END, "\n")
    .replace(TAG, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Required rich-text field: sanitised, then length-checked. */
export function richText(max: number) {
  return z.string().transform(sanitizeRichText).pipe(z.string().min(1).max(max));
}

/** Optional rich-text field (pass `undefined` for empty input). */
export function optionalRichText(max: number) {
  return z.string().transform(sanitizeRichText).pipe(z.string().max(max)).optional();
}

export type RichInline =
  | { type: "text"; text: string }
  | { type: "strong"; text: string }
  | { type: "link"; href: string; text: string };

export type RichBlock =
  | { type: "heading"; level: 2 | 3; content: RichInline[] }
  | { type: "list"; items: RichInline[][] }
  | { type: "paragraph"; lines: RichInline[][] };

const INLINE = /\*\*([^*\n]+)\*\*|(https?:\/\/[^\s<>"]+)/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/;
const BULLET = /^\s*[-*•]\s+/;

export function parseInline(line: string): RichInline[] {
  const out: RichInline[] = [];
  let last = 0;
  for (const match of line.matchAll(INLINE)) {
    const index = match.index ?? 0;
    if (index > last) out.push({ type: "text", text: line.slice(last, index) });
    if (match[1]) {
      out.push({ type: "strong", text: match[1] });
      last = index + match[0].length;
      continue;
    }
    const raw = match[2] ?? "";
    const trailing = raw.match(TRAILING_PUNCTUATION)?.[0] ?? "";
    const href = raw.slice(0, raw.length - trailing.length);
    out.push({ type: "link", href, text: href.replace(/^https?:\/\//, "") });
    last = index + href.length;
  }
  if (last < line.length) out.push({ type: "text", text: line.slice(last) });
  return out;
}

const HEADING = /^(#{2,3})\s+(.+)$/;

/** Splits one paragraph chunk into heading / list / paragraph runs. */
function chunkBlocks(lines: string[]): RichBlock[] {
  const blocks: RichBlock[] = [];
  for (const line of lines) {
    const prev = blocks.at(-1);
    const heading = line.match(HEADING);
    if (heading) {
      const level = heading[1]!.length === 2 ? 2 : 3;
      blocks.push({ type: "heading", level, content: parseInline(heading[2]!) });
    } else if (BULLET.test(line)) {
      const item = parseInline(line.replace(BULLET, ""));
      if (prev?.type === "list") prev.items.push(item);
      else blocks.push({ type: "list", items: [item] });
    } else if (prev?.type === "paragraph") {
      prev.lines.push(parseInline(line));
    } else {
      blocks.push({ type: "paragraph", lines: [parseInline(line)] });
    }
  }
  return blocks;
}

export function parseRichText(text: string | null | undefined): RichBlock[] {
  if (!text) return [];
  return sanitizeRichText(text)
    .split(/\n{2,}/)
    .flatMap((chunk) => chunkBlocks(chunk.split("\n").filter((line) => line.trim() !== "")));
}
