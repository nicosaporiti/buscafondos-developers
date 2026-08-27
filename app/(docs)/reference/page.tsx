import type { Metadata } from "next";
import { ApiReference } from "@/components/api-reference";
import { openApiDocument } from "@/lib/openapi/document";

export const metadata: Metadata = { title: "Referencia API", description: "Endpoints, parámetros, respuestas y modelos generados desde OpenAPI.", alternates: { canonical: "/reference" } };

export default function ReferencePage() {
  return <><span className="page-kicker">OpenAPI {openApiDocument.openapi}</span><h1>Referencia API</h1><p>Generada desde el snapshot versionado de <code>api.buscafondos.com/openapi.json</code>. El contrato del backend es la fuente de verdad.</p><ApiReference /></>;
}
