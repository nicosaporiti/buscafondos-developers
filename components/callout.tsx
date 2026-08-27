import type { ReactNode } from "react";

export function Callout({ children, title, tone = "info" }: { readonly children: ReactNode; readonly title: string; readonly tone?: "info" | "warning" | "success" }) {
  return <aside className="callout" data-tone={tone}><strong>{title}</strong><div>{children}</div></aside>;
}
