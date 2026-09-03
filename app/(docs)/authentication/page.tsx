import type { Metadata } from "next";
import Content from "@/content/authentication.mdx";

export const metadata: Metadata = { title: "Autenticación", description: "Header X-Api-Key, alternativa Bearer y manejo de la key en backend y navegador.", alternates: { canonical: "/authentication" } };
export default function Page() { return <Content />; }
