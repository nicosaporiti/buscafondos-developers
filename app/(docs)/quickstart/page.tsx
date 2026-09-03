import type { Metadata } from "next";
import Content from "@/content/quickstart.mdx";

export const metadata: Metadata = { title: "Quickstart", description: "Registro, verificación de la key y primer request a la API de BuscaFondos.", alternates: { canonical: "/quickstart" } };
export default function Page() { return <Content />; }
