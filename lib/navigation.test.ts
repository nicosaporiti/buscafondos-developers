import { describe, expect, it } from "vitest";
import { documentationNavigation } from "./navigation";

describe("documentation navigation", () => {
  it("contains every required public section exactly once", () => {
    const paths = documentationNavigation.map((item) => item.href);
    expect(new Set(paths).size).toBe(paths.length);
    expect(paths).toEqual(expect.arrayContaining(["/quickstart", "/authentication", "/quotas-errors", "/reference", "/playground", "/api-keys", "/changelog", "/status-support"]));
  });
});
