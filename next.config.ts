import createMDX from "@next/mdx";
import type { NextConfig } from "next";

import { createContentSecurityPolicy } from "./lib/content-security-policy";

const runtimeEnvironment =
  process.env.NODE_ENV === "development" ? "development" : "production";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: createContentSecurityPolicy(runtimeEnvironment),
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
