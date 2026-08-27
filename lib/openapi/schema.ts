import { z } from "zod";

const SecurityRequirementSchema = z.record(z.string(), z.array(z.string()));
const ParameterSchema = z.object({
  name: z.string(),
  in: z.enum(["path", "query", "header", "cookie"]),
  required: z.boolean().optional(),
  description: z.string().optional(),
  schema: z.record(z.string(), z.unknown()).optional(),
  example: z.unknown().optional(),
}).passthrough();
const MediaTypeSchema = z.object({
  schema: z.record(z.string(), z.unknown()).optional(),
  example: z.unknown().optional(),
  examples: z.record(z.string(), z.unknown()).optional(),
}).passthrough();
const ResponseSchema = z.object({
  description: z.string(),
  headers: z.record(z.string(), z.unknown()).optional(),
  content: z.record(z.string(), MediaTypeSchema).optional(),
}).passthrough();
const RequestBodySchema = z.object({
  description: z.string().optional(),
  content: z.record(z.string(), MediaTypeSchema),
  required: z.boolean().optional(),
}).passthrough();
const OperationSchema = z.object({
  tags: z.array(z.string()).optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  operationId: z.string().optional(),
  parameters: z.array(ParameterSchema).optional(),
  requestBody: RequestBodySchema.optional(),
  responses: z.record(z.string(), ResponseSchema),
  security: z.array(SecurityRequirementSchema).optional(),
}).passthrough();
const PathItemSchema = z.object({
  get: OperationSchema.optional(),
  post: OperationSchema.optional(),
  put: OperationSchema.optional(),
  patch: OperationSchema.optional(),
  delete: OperationSchema.optional(),
  parameters: z.array(ParameterSchema).optional(),
}).passthrough();
const TagSchema = z.object({ name: z.string(), description: z.string().optional() }).passthrough();
const ApiKeySecuritySchemeSchema = z.object({
  type: z.literal("apiKey"),
  in: z.literal("header"),
  name: z.literal("X-Api-Key"),
}).passthrough();
const SecuritySchemesSchema = z.object({
  "X-Api-Key": ApiKeySecuritySchemeSchema,
}).catchall(z.record(z.string(), z.unknown()));
const ComponentsSchema = z.object({
  schemas: z.record(z.string(), z.record(z.string(), z.unknown())).optional(),
  securitySchemes: SecuritySchemesSchema,
}).passthrough();

export const OpenApiSchema = z.object({
  openapi: z.string().regex(/^3\./, "Se requiere OpenAPI 3.x"),
  info: z.object({ title: z.string(), version: z.string(), description: z.string().optional() }).passthrough(),
  tags: z.array(TagSchema).optional(),
  paths: z.record(z.string().startsWith("/"), PathItemSchema),
  components: ComponentsSchema,
}).passthrough();

export type OpenApiDocument = z.infer<typeof OpenApiSchema>;
export type OpenApiOperation = z.infer<typeof OperationSchema>;
export type OpenApiParameter = z.infer<typeof ParameterSchema>;

export function parseOpenApi(value: unknown): OpenApiDocument {
  const result = OpenApiSchema.safeParse(value);
  if (!result.success) {
    throw new Error(`Snapshot OpenAPI inválido:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
