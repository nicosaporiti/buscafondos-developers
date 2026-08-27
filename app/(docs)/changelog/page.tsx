import type { Metadata } from "next";
import Content from "@/content/changelog.mdx";

export const metadata: Metadata = { title: "Changelog", description: "Cambios públicos del portal y contrato de la API BuscaFondos.", alternates: { canonical: "/changelog" } };
export default function Page() { return <Content />; }
