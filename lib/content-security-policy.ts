type RuntimeEnvironment = "development" | "production";

export function createContentSecurityPolicy(
  environment: RuntimeEnvironment,
): string {
  const developmentEvalSource =
    environment === "development" ? " 'unsafe-eval'" : "";

  return [
    "default-src 'self'",
    "connect-src 'self' https://api.buscafondos.com",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    `script-src 'self' 'unsafe-inline'${developmentEvalSource}`,
    "font-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}
