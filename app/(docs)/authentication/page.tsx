import type { Metadata } from "next";
import Content from "@/content/authentication.mdx";

export const metadata: Metadata = { title: "Autenticación", description: "Autentica requests con X-Api-Key o Bearer de forma segura.", alternates: { canonical: "/authentication" } };
export default function Page() { return <Content />; }
