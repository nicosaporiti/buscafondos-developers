import type { OpenApiDocument, OpenApiOperation, OpenApiParameter } from "./schema";

export const HTTP_METHODS = ["get", "post", "put", "patch", "delete"] as const;
export type HttpMethod = typeof HTTP_METHODS[number];

export type DocumentedOperation = Readonly<{
  path: string;
  method: HttpMethod;
  operation: OpenApiOperation;
  parameters: readonly OpenApiParameter[];
  tag: string;
}>;

export type AccessLabel = "API key" | "Público" | "Sin X-Api-Key";

export function listOperations(document: OpenApiDocument): readonly DocumentedOperation[] {
  return Object.entries(document.paths).flatMap(([path, item]) => HTTP_METHODS.flatMap((method) => {
    const operation = item[method];
    if (!operation) return [];
    return [{
      path,
      method,
      operation,
      parameters: [...(item.parameters ?? []), ...(operation.parameters ?? [])],
      tag: operation.tags?.[0] ?? "Other",
    }];
  }));
}

export function groupedOperations(document: OpenApiDocument): readonly Readonly<{ tag: string; description?: string; operations: readonly DocumentedOperation[] }>[] {
  const operations = listOperations(document);
  const tagOrder = document.tags?.map((tag) => tag.name) ?? [];
  const actualTags = [...new Set(operations.map((operation) => operation.tag))];
  const orderedTags = [...tagOrder.filter((tag) => actualTags.includes(tag)), ...actualTags.filter((tag) => !tagOrder.includes(tag))];
  return orderedTags.map((tag) => ({
    tag,
    description: document.tags?.find((item) => item.name === tag)?.description,
    operations: operations.filter((operation) => operation.tag === tag),
  }));
}

export function isApiKeyProtected(operation: OpenApiOperation): boolean {
  return operation.security?.some((requirement) => "X-Api-Key" in requirement) ?? false;
}

export function accessLabel(path: string, operation: OpenApiOperation): AccessLabel {
  if (isApiKeyProtected(operation)) return "API key";
  if (path === "/health") return "Público";
  return "Sin X-Api-Key";
}

export function operationAnchor(method: HttpMethod, path: string): string {
  return `${method}-${path}`.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

export function curlExample(operation: DocumentedOperation): string {
  const query = operation.parameters.filter((parameter) => parameter.in === "query" && parameter.required).map((parameter, index) => `${index === 0 ? "?" : "&"}${parameter.name}=VALUE`).join("");
  const method = operation.method === "get" ? "" : ` -X ${operation.method.toUpperCase()}`;
  const auth = isApiKeyProtected(operation.operation) ? " \\\n  -H \"X-Api-Key: $BUSCAFONDOS_API_KEY\"" : "";
  const jsonBody = operation.operation.requestBody?.content["application/json"];
  const contentType = jsonBody ? " \\\n  -H \"Content-Type: application/json\"" : "";
  const body = jsonBody ? " \\\n  -d 'JSON_BODY'" : "";
  return `curl${method} \"https://api.buscafondos.com${operation.path}${query}\"${auth}${contentType}${body}`;
}
