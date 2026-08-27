import type { Metadata } from "next";
import Content from "@/content/quotas-errors.mdx";

export const metadata: Metadata = { title: "Cuotas y errores", description: "Headers de cuota, códigos HTTP y retry para la API BuscaFondos.", alternates: { canonical: "/quotas-errors" } };
export default function Page() { return <Content />; }
