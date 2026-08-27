import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OpenApiMarkdown } from "./openapi-markdown";

describe("OpenAPI markdown sanitization", () => {
  it("renders safe links and never interprets HTML", () => {
    render(<OpenApiMarkdown parentHeadingLevel={2} source={'### Inicio\n[Registro](https://api.buscafondos.com/register)\n<img src=x onerror=alert(1)>'} />);
    expect(screen.getByRole("heading", { name: "Inicio", level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Registro" })).toHaveAttribute("href", "https://api.buscafondos.com/register");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText(/<img src=x/)).toBeInTheDocument();
  });

  it("normalizes Markdown headings to the surrounding semantic level", () => {
    const { rerender } = render(<OpenApiMarkdown parentHeadingLevel={2} source={"## Primer paso\n### Detalle"} />);

    expect(screen.getByRole("heading", { name: "Primer paso", level: 3 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Detalle", level: 4 })).toBeInTheDocument();

    rerender(<OpenApiMarkdown parentHeadingLevel={3} source="### Detalle de operación" />);
    expect(screen.getByRole("heading", { name: "Detalle de operación", level: 4 })).toBeInTheDocument();

    rerender(<OpenApiMarkdown source="## Encabezado existente" />);
    expect(screen.getByRole("heading", { name: "Encabezado existente", level: 4 })).toBeInTheDocument();
  });
});
