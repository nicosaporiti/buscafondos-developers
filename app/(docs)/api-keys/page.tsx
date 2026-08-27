import type { Metadata } from "next";
import Content from "@/content/api-keys.mdx";

export const metadata: Metadata = { title: "API keys", description: "Emisión, cuidado y verificación de API keys de BuscaFondos.", alternates: { canonical: "/api-keys" } };
export default function Page() { return <Content />; }
