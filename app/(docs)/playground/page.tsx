import type { Metadata } from "next";
import { Playground, type PlaygroundEndpoint, type PlaygroundParameter } from "@/components/playground";
import { openApiDocument } from "@/lib/openapi/document";
import { isApiKeyProtected, isNumericParameter, listOperations, parameterDefault, parameterOptions } from "@/lib/openapi/operations";
import type { OpenApiParameter } from "@/lib/openapi/schema";

export const metadata: Metadata = { title: "Playground", description: "Requests GET a la API de BuscaFondos desde el navegador. La key no pasa por el portal.", alternates: { canonical: "/playground" }, robots: { index: false, follow: false } };

function playgroundParameter(parameter: OpenApiParameter, required: boolean): PlaygroundParameter {
  return {
    name: parameter.name,
    required,
    description: parameter.description,
    options: parameterOptions(parameter.schema, openApiDocument),
    defaultValue: parameterDefault(parameter.schema),
    numeric: isNumericParameter(parameter.schema),
  };
}

function playgroundEndpoints(): readonly PlaygroundEndpoint[] {
  return listOperations(openApiDocument).filter((item) => item.method === "get" && (item.path === "/health" || isApiKeyProtected(item.operation))).toSorted((left, right) => {
    const priority = (path: string) => path === "/api/key/info" ? 0 : path === "/health" ? 2 : 1;
    return priority(left.path) - priority(right.path);
  }).map((item) => ({
    id: item.operation.operationId ?? `${item.method}-${item.path}`,
    path: item.path,
    summary: item.operation.summary ?? item.path,
    protected: isApiKeyProtected(item.operation),
    pathParameters: item.parameters.filter((parameter) => parameter.in === "path").map((parameter) => playgroundParameter(parameter, parameter.required ?? true)),
    queryParameters: item.parameters.filter((parameter) => parameter.in === "query").map((parameter) => playgroundParameter(parameter, parameter.required ?? false)),
  }));
}

export default function PlaygroundPage() {
  return <><h1>Playground</h1><p>Ejecuta requests GET del contrato directamente contra la API desde este navegador. La key se mantiene solo en memoria: no se guarda en cookies, <code>localStorage</code>, <code>sessionStorage</code> ni URLs, y el portal no tiene analytics ni logs que la reciban.</p><Playground endpoints={playgroundEndpoints()} /></>;
}
