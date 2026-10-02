import type { Metadata } from "next";
import Content from "@/content/quotas-errors.mdx";

export const metadata: Metadata = { title: "Cuotas y errores", description: "Límites por tier, headers de cuota, códigos de estado del middleware y retry con backoff.", alternates: { canonical: "/quotas-errors" } };
export default function Page() { return <Content />; }
