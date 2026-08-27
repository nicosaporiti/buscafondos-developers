export type NavigationItem = Readonly<{
  href: string;
  label: string;
  description: string;
}>;

export const documentationNavigation = [
  { href: "/quickstart", label: "Quickstart", description: "Tu primer request" },
  { href: "/authentication", label: "Autenticación", description: "API keys y seguridad" },
  { href: "/quotas-errors", label: "Cuotas y errores", description: "Límites, códigos y retry" },
  { href: "/reference", label: "Referencia API", description: "Contrato OpenAPI" },
  { href: "/playground", label: "Playground", description: "Prueba GET en el navegador" },
  { href: "/api-keys", label: "API keys", description: "Emisión y consumo" },
  { href: "/changelog", label: "Changelog", description: "Cambios del portal" },
  { href: "/status-support", label: "Estado y soporte", description: "Salud y ayuda" },
] as const satisfies readonly NavigationItem[];
