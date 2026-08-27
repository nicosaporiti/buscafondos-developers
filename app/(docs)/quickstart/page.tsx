import type { Metadata } from "next";
import Content from "@/content/quickstart.mdx";

export const metadata: Metadata = { title: "Quickstart", description: "Obtén una API key y haz tu primer request a la API BuscaFondos.", alternates: { canonical: "/quickstart" } };
export default function Page() { return <Content />; }
