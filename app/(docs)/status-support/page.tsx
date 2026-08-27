import type { Metadata } from "next";
import Content from "@/content/status-support.mdx";

export const metadata: Metadata = { title: "Estado y soporte", description: "Estado de la API y canales de soporte confirmados.", alternates: { canonical: "/status-support" } };
export default function Page() { return <Content />; }
