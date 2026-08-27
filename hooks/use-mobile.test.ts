import { describe, expect, it } from "vitest"

import { MOBILE_BREAKPOINT, MOBILE_QUERY } from "./use-mobile"

describe("mobile breakpoint", () => {
  it("includes the 900px layout boundary but excludes 901px", () => {
    const matchesMobileQuery = (width: number) => width <= MOBILE_BREAKPOINT

    expect(MOBILE_QUERY).toBe("(max-width: 900px)")
    expect(matchesMobileQuery(900)).toBe(true)
    expect(matchesMobileQuery(901)).toBe(false)
  })
})
