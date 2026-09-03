# Decisiones de arquitectura

## Resumen

Next.js App Router con páginas estáticas, contenido MDX local y una referencia renderizada desde un snapshot OpenAPI versionado. Prioridades: builds reproducibles, SEO y mantenimiento por una sola persona. Autenticación y dashboard quedan como módulos futuros que no exigen rehacer lo actual.

## Framework y rendering

- **Next.js 16 + React 19 + TypeScript estricto.** App Router entrega metadata, sitemap, robots, headers y rutas estáticas en un solo proyecto desplegable en Vercel.
- Las guías, home y referencia no hacen fetch durante runtime ni build. La API puede estar caída y el portal sigue construyéndose.
- Solo el playground es un Client Component con acceso a red, y cada request lo inicia el usuario.
- No existe API route, proxy, base de datos ni servidor de credenciales en el portal.

## Contenido

- Las guías viven en `content/*.mdx` y se montan desde rutas pequeñas con metadata por página.
- Endpoints, parámetros, respuestas, autenticación y modelos no se duplican en MDX: `components/api-reference.tsx` transforma el snapshot.
- El changelog empieza sin entradas. El formato de entrada está documentado en el README.

## OpenAPI

1. `scripts/update-openapi.ts` descarga producción usando un User-Agent identificable.
2. Zod valida la forma mínima de OpenAPI 3.x y la presencia de `X-Api-Key`.
3. Se escribe `openapi/buscafondos.openapi.json`, que queda versionado.
4. `scripts/validate-openapi.ts` corre antes de cada build.
5. La referencia, navegación por tags y endpoints del playground se derivan del mismo documento.

La validación cubre solo las partes del documento que el portal consume. Validar contra el JSON Schema oficial de OpenAPI es una extensión posible.

## shadcn/ui

shadcn/ui se inicializó con su CLI oficial v4 (`radix-nova`, Radix, Tailwind v4). Se usa como código fuente mantenible para Button, Input, Label, Select, Card, Badge, Dialog/Command, Sheet/Sidebar, Accordion, Tabs y primitives auxiliares.

El tema default fue reemplazado por tokens monocromos derivados de la guía de diseño de Vercel (`design-system/buscafondos-developers/vercel-design.md`), aplicada en `design-system/buscafondos-developers/MASTER.md`. Geist Sans y Geist Mono se empaquetan localmente con el paquete `geist` sobre `next/font/local`, evitando dependencia de Google Fonts durante el build y manteniendo `font-src 'self'` en la CSP. Decisiones de composición: la home abre con el primer request en curl y cifras leídas del snapshot OpenAPI; la referencia separa operaciones con reglas en lugar de tarjetas; el playground es una sola vista de request y response.

## Seguridad

- Sin secretos ni variables públicas.
- CSP limita conexiones a `self` y `https://api.buscafondos.com`.
- Headers incluyen `nosniff`, `DENY`, referrer policy, permissions policy y COOP.
- El texto de OpenAPI se renderiza como nodos React; no se interpreta HTML ni se usa `dangerouslySetInnerHTML` con contenido externo.
- La única excepción de HTML inline es un script estático y controlado que aplica el tema antes del paint.
- El playground mantiene la key en memoria y solo hace GET directos a la API.
- No hay analytics ni captura de errores de terceros.
- `/playground` lleva `noindex` y se excluye del sitemap.

## Futuro login/dashboard

La ruta `/api-keys` documenta el flujo de emisión sin reimplementarlo. Un dashboard futuro requiere autenticación server-side, autorización, rotación de keys y páginas no indexables, como módulo separado; las guías y la referencia no cambian.

## Alternativas descartadas

- **Referencia SaaS embebida:** agrega dependencia externa y dificulta sanitización/branding.
- **Fetch de OpenAPI en cada build:** rompe reproducibilidad si producción falla.
- **Proxy del playground:** amplía la superficie de secretos, logs y operación sin aportar nada al flujo GET actual.
- **Framework exclusivo de docs:** más rápido al inicio, menos flexible para un dashboard futuro y para el branding.
