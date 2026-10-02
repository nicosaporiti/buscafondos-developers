export type NavigationItem = Readonly<{
  href: string;
  label: string;
  description: string;
}>;

export const documentationNavigation = [
  { href: "/quickstart", label: "Quickstart", description: "Tu primer request" },
  { href: "/authentication", label: "Autenticación", description: "API keys y seguridad" },
  { href: "/quotas-errors", label: "Cuotas y errores", description: "Límites por tier, códigos y retry" },
  { href: "/reference", label: "Referencia API", description: "Contrato OpenAPI" },
  { href: "/playground", label: "Playground", description: "Requests GET desde el navegador" },
  { href: "/api-keys", label: "API keys", description: "Emisión y consumo" },
  { href: "/changelog", label: "Changelog", description: "Cambios del portal" },
  { href: "/status-support", label: "Estado y soporte", description: "Health check y contacto" },
] as const satisfies readonly NavigationItem[];
