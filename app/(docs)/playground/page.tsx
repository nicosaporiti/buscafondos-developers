import type { Metadata } from "next";
import { Playground, type PlaygroundEndpoint } from "@/components/playground";
import { openApiDocument } from "@/lib/openapi/document";
import { isApiKeyProtected, listOperations } from "@/lib/openapi/operations";

export const metadata: Metadata = { title: "Playground", description: "Prueba endpoints GET de BuscaFondos sin enviar tu key al portal.", alternates: { canonical: "/playground" }, robots: { index: false, follow: false } };

function playgroundEndpoints(): readonly PlaygroundEndpoint[] {
  return listOperations(openApiDocument).filter((item) => item.method === "get" && (item.path === "/health" || isApiKeyProtected(item.operation))).toSorted((left, right) => {
    const priority = (path: string) => path === "/api/key/info" ? 0 : path === "/health" ? 2 : 1;
    return priority(left.path) - priority(right.path);
  }).map((item) => ({
    id: item.operation.operationId ?? `${item.method}-${item.path}`,
    path: item.path,
    summary: item.operation.summary ?? item.path,
    protected: isApiKeyProtected(item.operation),
    pathParameters: item.parameters.filter((parameter) => parameter.in === "path").map((parameter) => ({ name: parameter.name, required: parameter.required ?? true })),
    queryParameters: item.parameters.filter((parameter) => parameter.in === "query").map((parameter) => ({ name: parameter.name, required: parameter.required ?? false })),
  }));
}

export default function PlaygroundPage() {
  return <><h1>Playground</h1><p>Prueba endpoints GET documentados directamente contra la API desde este navegador. La credencial vive sólo en memoria: no se guarda en cookies, <code>localStorage</code>, <code>sessionStorage</code>, URLs, analytics ni logs del portal.</p><Playground endpoints={playgroundEndpoints()} /></>;
}
