# Decisiones de arquitectura

## Resumen

Next.js App Router con páginas static-first, contenido MDX local y una referencia renderizada desde un snapshot OpenAPI versionado. La arquitectura prioriza builds reproducibles, SEO y mantenimiento por una sola persona sin cerrar la puerta a autenticación y dashboard futuros.

## Framework y rendering

- **Next.js 16 + React 19 + TypeScript estricto.** App Router entrega metadata, sitemap, robots, headers y rutas estáticas en un solo proyecto desplegable en Vercel.
- Las guías, home y referencia no hacen fetch durante runtime ni build. La API puede estar caída y el portal sigue construyéndose.
- Sólo el playground es un Client Component con red, iniciada explícitamente por el usuario.
- No existe API route, proxy, base de datos ni servidor de credenciales en el portal.

## Contenido

- Las guías viven en `content/*.mdx` y se montan desde rutas pequeñas con metadata por página.
- Endpoints, parámetros, respuestas, autenticación y modelos no se duplican en MDX: `components/api-reference.tsx` transforma el snapshot.
- El changelog empieza vacío de historia de versiones; explica cómo agregar entradas futuras.

## OpenAPI

1. `scripts/update-openapi.ts` descarga producción usando un User-Agent identificable.
2. Zod valida la forma mínima de OpenAPI 3.x y la presencia de `X-Api-Key`.
3. Se escribe `openapi/buscafondos.openapi.json`, que queda versionado.
4. `scripts/validate-openapi.ts` corre antes de cada build.
5. La referencia, navegación por tags y endpoints del playground se derivan del mismo documento.

Validar estructura completa contra la especificación JSON Schema oficial podría añadirse más adelante. La validación actual es deliberadamente pequeña y enfocada en las superficies que el portal consume.

## shadcn/ui

shadcn/ui se inicializó con su CLI oficial v4 (`radix-nova`, Radix, Tailwind v4). Se usa como código fuente mantenible para Button, Input, Label, Select, Card, Badge, Dialog/Command, Sheet/Sidebar, Accordion, Tabs y primitives auxiliares.

El tema default fue reemplazado por tokens monocromos derivados de la guía de diseño de Vercel (`design-system/buscafondos-developers/vercel-design.md`), aplicada en `design-system/buscafondos-developers/MASTER.md`. Geist Sans y Geist Mono se empaquetan localmente con el paquete `geist` sobre `next/font/local`, evitando dependencia de Google Fonts durante el build y manteniendo `font-src 'self'` en la CSP. La composición evita el aspecto de plantilla: apertura guiada por la afirmación con el primer request como evidencia, cifras y tabla de áreas generadas desde el snapshot OpenAPI, referencia separada por reglas en vez de tarjetas y un playground como una sola herramienta.

## Seguridad

- Sin secretos ni variables públicas.
- CSP limita conexiones a `self` y `https://api.buscafondos.com`.
- Headers incluyen `nosniff`, `DENY`, referrer policy, permissions policy y COOP.
- Texto de OpenAPI se renderiza como nodos React; no se interpreta HTML ni se usa `dangerouslySetInnerHTML` con contenido externo.
- La única excepción de HTML inline es un script estático y controlado que aplica el tema antes del paint.
- El playground mantiene la key en memoria y sólo hace GET directos a la API.
- No hay analytics ni captura de errores de terceros.
- `/playground` lleva `noindex` y se excluye del sitemap.

## Futuro login/dashboard

La ruta `/api-keys` reserva el lugar conceptual, pero no reimplementa emisión. Un dashboard futuro debe añadir autenticación server-side, autorización, rotación y páginas no indexables como un módulo separado; no requiere rehacer guías o referencia.

## Alternativas descartadas

- **Referencia SaaS embebida:** agrega dependencia externa y dificulta sanitización/branding.
- **Fetch de OpenAPI en cada build:** rompe reproducibilidad si producción falla.
- **Proxy del playground:** aumenta alcance de secretos, logs y operación sin aportar valor al flujo GET actual.
- **Framework exclusivo de docs:** más rápido al inicio, menos flexible para dashboard/account futuros y branding profundo.
