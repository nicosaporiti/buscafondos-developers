import type { Metadata } from "next";
import Content from "@/content/status-support.mdx";

export const metadata: Metadata = { title: "Estado y soporte", description: "Endpoint /health y canal de soporte técnico de la API.", alternates: { canonical: "/status-support" } };
export default function Page() { return <Content />; }
