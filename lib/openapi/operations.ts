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

type JsonSchemaLike = Readonly<Record<string, unknown>>;

function isSchema(value: unknown): value is JsonSchemaLike {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function resolveReference(schema: JsonSchemaLike, document?: OpenApiDocument): JsonSchemaLike | undefined {
  const reference = schema.$ref;
  if (typeof reference !== "string") return undefined;
  const name = reference.startsWith("#/components/schemas/") ? reference.slice("#/components/schemas/".length) : undefined;
  const resolved = name ? document?.components.schemas?.[name] : undefined;
  return resolved && isSchema(resolved) ? resolved : undefined;
}

function referenceName(schema: JsonSchemaLike): string | undefined {
  return typeof schema.$ref === "string" ? schema.$ref.split("/").at(-1) : undefined;
}

function variants(schema: JsonSchemaLike): readonly JsonSchemaLike[] {
  const union = schema.anyOf ?? schema.oneOf;
  return Array.isArray(union) ? union.filter(isSchema) : [schema];
}

/** Human-readable type for a parameter schema: `string`, `integer | null`, `Article107RegulationStatus | null`. */
export function parameterType(schema: JsonSchemaLike | undefined): string {
  if (!schema) return "sin tipo";
  const names = variants(schema).flatMap((variant) => {
    const name = referenceName(variant);
    if (name) return [name];
    if (typeof variant.type === "string") return [variant.type];
    if (Array.isArray(variant.enum)) return ["enum"];
    return [];
  });
  const unique = [...new Set(names)];
  return unique.length > 0 ? unique.join(" | ") : "sin tipo";
}

/** Allowed values declared inline or through a `$ref` to a components schema; `undefined` when the parameter is free-form. */
export function parameterOptions(schema: JsonSchemaLike | undefined, document?: OpenApiDocument): readonly string[] | undefined {
  if (!schema) return undefined;
  const values = variants(schema).flatMap((variant) => {
    const target = resolveReference(variant, document) ?? variant;
    return Array.isArray(target.enum) ? target.enum.filter((value): value is string | number | boolean => ["string", "number", "boolean"].includes(typeof value)).map(String) : [];
  });
  return values.length > 0 ? values : undefined;
}

/** Declared default rendered as text, or `undefined` when the contract declares none. */
export function parameterDefault(schema: JsonSchemaLike | undefined): string | undefined {
  const value = schema?.default;
  if (value === undefined || value === null) return undefined;
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

/** True when every non-null variant of the schema is numeric. */
export function isNumericParameter(schema: JsonSchemaLike | undefined): boolean {
  if (!schema) return false;
  const concrete = variants(schema).filter((variant) => variant.type !== "null");
  return concrete.length > 0 && concrete.every((variant) => variant.type === "integer" || variant.type === "number");
}
