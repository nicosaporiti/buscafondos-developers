import type { ReactNode } from "react";

const INLINE_TOKEN = /(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;
const LINK_TOKEN = /^\[([^\]]+)\]\(([^)]+)\)$/;
const HEADING_TOKEN = /^(#{2,3})\s+(.+)$/;

type ParentHeadingLevel = 1 | 2 | 3 | 4;
type MarkdownHeadingLevel = 2 | 3;
type RenderedHeadingLevel = 2 | 3 | 4 | 5 | 6;

type MarkdownHeading = Readonly<{
  level: MarkdownHeadingLevel;
  text: string;
}>;

function safeHref(value: string): string | undefined {
  return value.startsWith("https://") || value.startsWith("http://") || value.startsWith("/") ? value : undefined;
}

function parseHeading(line: string): MarkdownHeading | undefined {
  const match = HEADING_TOKEN.exec(line);
  if (!match) return undefined;

  const marker = match[1];
  const text = match[2];
  if (!text) return undefined;
  if (marker === "##") return { level: 2, text };
  if (marker === "###") return { level: 3, text };
  return undefined;
}

function headingLevelFor(
  markdownLevel: MarkdownHeadingLevel,
  firstMarkdownHeadingLevel: MarkdownHeadingLevel | undefined,
  parentHeadingLevel: ParentHeadingLevel | undefined,
): RenderedHeadingLevel {
  if (parentHeadingLevel === undefined || firstMarkdownHeadingLevel === undefined) {
    return (markdownLevel + 2) as RenderedHeadingLevel;
  }

  return (parentHeadingLevel + 1 + markdownLevel - firstMarkdownHeadingLevel) as RenderedHeadingLevel;
}

function MarkdownHeading({ level, text }: Readonly<{ level: RenderedHeadingLevel; text: string }>) {
  const content = <InlineMarkdown text={text} />;
  switch (level) {
    case 2: return <h2>{content}</h2>;
    case 3: return <h3>{content}</h3>;
    case 4: return <h4>{content}</h4>;
    case 5: return <h5>{content}</h5>;
    case 6: return <h6>{content}</h6>;
  }
}

function InlineMarkdown({ text }: { readonly text: string }) {
  const nodes: ReactNode[] = text.split(INLINE_TOKEN).filter(Boolean).map((token, index) => {
    if (token.startsWith("`") && token.endsWith("`")) return <code key={index}>{token.slice(1, -1)}</code>;
    if (token.startsWith("**") && token.endsWith("**")) return <strong key={index}>{token.slice(2, -2)}</strong>;
    const link = LINK_TOKEN.exec(token);
    if (link) {
      const label = link[1] ?? "Enlace";
      const href = safeHref(link[2] ?? "");
      return href ? <a key={index} href={href}>{label}</a> : <span key={index}>{label}</span>;
    }
    return token;
  });
  return <>{nodes}</>;
}

export function OpenApiMarkdown({ source, parentHeadingLevel }: { readonly source: string; readonly parentHeadingLevel?: ParentHeadingLevel }) {
  const lines = source.split("\n").map((line) => line.trim()).filter(Boolean);
  const firstMarkdownHeadingLevel = lines.flatMap((line) => {
    const heading = parseHeading(line);
    return heading ? [heading.level] : [];
  }).at(0);

  return <div className="openapi-markdown">{lines.map((line, index) => {
    if (line === "---") return <hr key={index} />;
    const heading = parseHeading(line);
    if (heading) return <MarkdownHeading key={index} level={headingLevelFor(heading.level, firstMarkdownHeadingLevel, parentHeadingLevel)} text={heading.text} />;
    if (/^\d+\.\s/.test(line)) return <p className="markdown-step" key={index}><InlineMarkdown text={line} /></p>;
    if (line.startsWith("- ")) return <p className="markdown-list-item" key={index}><InlineMarkdown text={line.slice(2)} /></p>;
    return <p key={index}><InlineMarkdown text={line} /></p>;
  })}</div>;
}
