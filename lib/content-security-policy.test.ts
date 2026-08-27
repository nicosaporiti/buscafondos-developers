import { describe, expect, it } from "vitest";

import { createContentSecurityPolicy } from "./content-security-policy";

describe("createContentSecurityPolicy", () => {
  it("allows eval for React debugging in development", () => {
    expect(createContentSecurityPolicy("development")).toContain(
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    );
  });

  it("keeps eval disabled in production", () => {
    expect(createContentSecurityPolicy("production")).not.toContain(
      "'unsafe-eval'",
    );
  });
});
