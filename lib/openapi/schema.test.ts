import { describe, expect, it } from "vitest";
import { parseOpenApi } from "./schema";

function validOpenApiDocument(): Record<string, unknown> {
  return {
    openapi: "3.1.0",
    info: { title: "Test API", version: "1.0.0" },
    paths: {},
    components: {
      securitySchemes: {
        "X-Api-Key": {
          type: "apiKey",
          in: "header",
          name: "X-Api-Key",
          "x-provider-setting": "preserved",
        },
        BearerAuth: { type: "http", scheme: "bearer" },
      },
      "x-components-setting": "preserved",
    },
    "x-document-setting": "preserved",
  };
}

function withApiKeySecurityScheme(overrides: Record<string, unknown>): Record<string, unknown> {
  const document = validOpenApiDocument();
  const components = document.components as Record<string, unknown>;
  const securitySchemes = components.securitySchemes as Record<string, unknown>;
  securitySchemes["X-Api-Key"] = {
    type: "apiKey",
    in: "header",
    name: "X-Api-Key",
    ...overrides,
  };
  return document;
}

describe("parseOpenApi", () => {
  it("accepts the portal API key header scheme and OpenAPI extensions", () => {
    const document = parseOpenApi(validOpenApiDocument());

    expect(document.components.securitySchemes["X-Api-Key"]).toMatchObject({
      type: "apiKey",
      in: "header",
      name: "X-Api-Key",
      "x-provider-setting": "preserved",
    });
    expect(document["x-document-setting"]).toBe("preserved");
  });

  it.each([
    ["type", { type: "http" }],
    ["location", { in: "query" }],
    ["name", { name: "Authorization" }],
  ])("rejects an API key scheme with the wrong %s", (_field, overrides) => {
    expect(() => parseOpenApi(withApiKeySecurityScheme(overrides))).toThrow("Snapshot OpenAPI inválido");
  });
});
