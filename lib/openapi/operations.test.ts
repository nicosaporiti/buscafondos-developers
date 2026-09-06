import { describe, expect, it } from "vitest";
import { openApiDocument } from "./document";
import { accessLabel, curlExample, groupedOperations, isNumericParameter, listOperations, parameterDefault, parameterOptions, parameterType } from "./operations";

describe("OpenAPI reference", () => {
  it("builds navigation by real tags without losing operations", () => {
    const operations = listOperations(openApiDocument);
    const grouped = groupedOperations(openApiDocument).flatMap((group) => group.operations);
    expect(operations).toHaveLength(36);
    expect(grouped).toHaveLength(operations.length);
    expect(operations.some((item) => item.path === "/api/market-summary")).toBe(true);
  });

  it("exposes the returns, compare and screener operations added to the contract", () => {
    const operations = listOperations(openApiDocument);
    const paths = operations.filter((item) => item.method === "get").map((item) => item.path);
    expect(paths).toEqual(expect.arrayContaining(["/api/real_assets/{asset_id}/returns", "/api/compare", "/api/screener"]));
    for (const path of ["/api/real_assets/{asset_id}/returns", "/api/compare", "/api/screener"]) {
      expect(operations.find((item) => item.path === path)?.operation.security).toEqual([{ "X-Api-Key": [] }]);
    }
  });

  it("groups the Fund Returns operations under the declared tag, in contract order", () => {
    const groups = groupedOperations(openApiDocument);
    const fundReturns = groups.find((group) => group.tag === "Fund Returns");
    expect(fundReturns?.description).toMatch(/rentabilidades/i);
    expect(fundReturns?.operations.map((item) => item.path).toSorted()).toEqual(["/api/compare", "/api/screener"]);
    expect(groups.map((group) => group.tag).indexOf("Fund Returns")).toBe(groups.map((group) => group.tag).indexOf("Real Assets") + 1);
  });

  it("keeps operations whose tag is not declared at the top level, after the declared ones", () => {
    const groups = groupedOperations(openApiDocument);
    const declaredTags = new Set(openApiDocument.tags?.map((tag) => tag.name));
    const undeclared = groups.filter((group) => !declaredTags.has(group.tag));
    expect(undeclared.map((group) => group.tag)).toContain("Reports");
    const lastDeclaredIndex = groups.findLastIndex((group) => declaredTags.has(group.tag));
    for (const group of undeclared) expect(groups.indexOf(group)).toBeGreaterThan(lastDeclaredIndex);
    expect(groups.flatMap((group) => group.operations)).toHaveLength(listOperations(openApiDocument).length);
  });

  it("describes parameter schemas from the real snapshot", () => {
    const parameters = listOperations(openApiDocument).find((item) => item.path === "/api/real_assets/{asset_id}/returns")!.parameters;
    const byName = (name: string) => parameters.find((parameter) => parameter.name === name)!.schema;

    expect(parameterType(byName("asset_id"))).toBe("integer");
    expect(isNumericParameter(byName("asset_id"))).toBe(true);
    expect(parameterType(byName("as_of_date"))).toBe("string | null");
    expect(parameterOptions(byName("as_of_date"))).toBeUndefined();
    expect(parameterOptions(byName("valuation"))).toEqual(["accounting", "clp", "real_uf"]);
    expect(parameterDefault(byName("valuation"))).toBe("accounting");
    expect(parameterOptions(byName("return_basis"))).toEqual(["price", "total"]);
    expect(parameterDefault(byName("as_of_date"))).toBeUndefined();
  });

  it("resolves enum options declared through a $ref", () => {
    const parameter = listOperations(openApiDocument).find((item) => item.path === "/api/all-funds")!.parameters.find((item) => item.name === "article107_regulation_status")!;
    expect(parameterType(parameter.schema)).toBe("Article107RegulationStatus | null");
    expect(parameterOptions(parameter.schema)).toBeUndefined();
    expect(parameterOptions(parameter.schema, openApiDocument)).toEqual(openApiDocument.components.schemas?.Article107RegulationStatus?.enum);
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

  it("includes required query parameters in the curl example", () => {
    const compare = listOperations(openApiDocument).find((item) => item.path === "/api/compare");
    expect(curlExample(compare!)).toBe('curl "https://api.buscafondos.com/api/compare?series=VALUE" \\\n  -H "X-Api-Key: $BUSCAFONDOS_API_KEY"');
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
