import { describe, expect, it } from "vitest";
import { openApiDocument } from "./document";
import { accessLabel, curlExample, groupedOperations, listOperations } from "./operations";

describe("OpenAPI reference", () => {
  it("builds navigation by real tags without losing operations", () => {
    const operations = listOperations(openApiDocument);
    const grouped = groupedOperations(openApiDocument).flatMap((group) => group.operations);
    expect(operations).toHaveLength(33);
    expect(grouped).toHaveLength(operations.length);
    expect(operations.some((item) => item.path === "/api/market-summary")).toBe(true);
  });

  it("marks the health endpoint as public and data endpoints as protected", () => {
    const operations = listOperations(openApiDocument);
    expect(operations.find((item) => item.path === "/health")?.operation.security).toBeUndefined();
    expect(operations.find((item) => item.path === "/api/all-funds")?.operation.security).toEqual([{ "X-Api-Key": [] }]);
  });

  it("labels access honestly from the real snapshot", () => {
    const operations = listOperations(openApiDocument);
    const operationFor = (path: string) => {
      const operation = operations.find((item) => item.path === path);
      if (!operation) throw new Error(`Missing expected operation: ${path}`);
      return operation;
    };

    expect(accessLabel(operationFor("/health").path, operationFor("/health").operation)).toBe("Público");
    expect(accessLabel(operationFor("/api/all-funds").path, operationFor("/api/all-funds").operation)).toBe("API key");
    expect(accessLabel(operationFor("/api/me").path, operationFor("/api/me").operation)).toBe("Sin X-Api-Key");
  });

  it("generates a valid curl continuation for protected endpoints", () => {
    const protectedOperation = listOperations(openApiDocument).find((item) => item.path === "/api/all-funds");
    const command = curlExample(protectedOperation!);

    expect(command).toBe(
      'curl "https://api.buscafondos.com/api/all-funds" \\\n  -H "X-Api-Key: $BUSCAFONDOS_API_KEY"',
    );
    expect(command).not.toContain("\n+");
  });

  it.each([
    [
      "/api/auth/magic-link",
      "post",
      'curl -X POST "https://api.buscafondos.com/api/auth/magic-link" \\\n  -H "Content-Type: application/json" \\\n  -d \'JSON_BODY\'',
    ],
    [
      "/api/me/alerts",
      "patch",
      'curl -X PATCH "https://api.buscafondos.com/api/me/alerts" \\\n  -H "Content-Type: application/json" \\\n  -d \'JSON_BODY\'',
    ],
    ["/api/me", "delete", 'curl -X DELETE "https://api.buscafondos.com/api/me"'],
  ])("generates an accurate curl example for %s %s", (path, method, expectedCommand) => {
    const operation = listOperations(openApiDocument).find((item) => item.path === path && item.method === method);
    if (!operation) throw new Error(`Missing expected operation: ${method.toUpperCase()} ${path}`);

    expect(curlExample(operation)).toBe(expectedCommand);
  });

  it("keeps required JSON request bodies available to consumers", () => {
    const operation = listOperations(openApiDocument).find((item) => item.path === "/api/me/watchlist" && item.method === "post");
    if (!operation) throw new Error("Missing expected POST /api/me/watchlist operation");

    expect(operation.operation.requestBody).toMatchObject({
      required: true,
      content: { "application/json": { schema: { $ref: "#/components/schemas/WatchlistRequest" } } },
    });
  });
});
