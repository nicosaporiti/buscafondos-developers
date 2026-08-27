import { CopyButton } from "./copy-button";

export function CodeExample({ code, language = "text", title }: { readonly code: string; readonly language?: string; readonly title?: string }) {
  return (
    <figure className="code-example">
      <figcaption><span>{title ?? language}</span><CopyButton value={code} /></figcaption>
      <pre tabIndex={0}><code data-language={language}>{code}</code></pre>
    </figure>
  );
}
