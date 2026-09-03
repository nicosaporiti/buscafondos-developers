# BuscaFondos Developers

Portal de documentación y onboarding para la API de fondos mutuos chilenos de [BuscaFondos](https://www.buscafondos.com).

- Portal: `https://developers.buscafondos.com`
- API: `https://api.buscafondos.com`
- Backend: repositorio privado; el portal no enlaza a él
- Soporte técnico: `api@buscafondos.com`

Este repositorio es independiente del backend y de la app principal. Ambos se consultaron como referencia; ninguno se modifica desde aquí.

## Requisitos

- Node.js 20.9 o superior
- npm 10 o superior

El portal no usa variables de entorno. No agregues API keys al repositorio ni a variables `NEXT_PUBLIC_*`.

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abre `http://localhost:3000`. Las guías y la referencia se sirven desde archivos locales. El único tráfico hacia `api.buscafondos.com` lo genera el playground, desde el navegador y a pedido del usuario.

## Calidad y build

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run check:bundle-secrets
```

Para ejecutar todo en orden:

```bash
npm run check
```

`check:bundle-secrets` recorre los artefactos de `.next` y falla si encuentra un patrón de API key `bf_…`. Complementa, no reemplaza, la revisión de secretos del repositorio.

## Actualizar el snapshot OpenAPI

El contrato lo define el backend. El portal versiona un snapshot en `openapi/buscafondos.openapi.json` para que el build no dependa de producción.

```bash
npm run openapi:update
npm run openapi:validate
npm test
```

`openapi:update` descarga `https://api.buscafondos.com/openapi.json`, valida que sea OpenAPI 3.x con el security scheme `X-Api-Key` y sobrescribe el snapshot con JSON de claves ordenadas. Revisa el diff antes de publicar. La referencia y el playground se regeneran desde ese archivo en cada build; los endpoints no se copian a MDX.

## Changelog

Las entradas viven en `content/changelog.mdx`, una sección `## YYYY-MM-DD: Título` por cambio. Cada entrada indica impacto, migración y contrato afectado. Si el cambio viene de la API, actualiza primero el snapshot y revisa su diff.

## shadcn/ui y diseño

El proyecto se inicializó con el CLI de shadcn/ui v4 (Radix, preset Nova, Tailwind CSS v4). Los componentes están en `components/ui` y la configuración en `components.json`.

```bash
npx shadcn@latest info
npx shadcn@latest add <componente>
```

shadcn aporta los primitives; la identidad visual sigue la guía de diseño de Vercel, copiada verbatim en `design-system/buscafondos-developers/vercel-design.md` y adaptada a este repositorio en `design-system/buscafondos-developers/MASTER.md`: paleta monocroma, Geist Sans y Geist Mono empaquetadas localmente con el paquete `geist`, escala tipográfica por rol y grilla de 12 columnas. Los tokens están en `app/globals.css`. Al agregar componentes, conserva labels explícitos, foco visible, targets accesibles y textos en español.

## Estructura

```text
app/                     App Router, metadata, sitemap y páginas
content/                 Guías en MDX
components/              UI del portal, referencia y playground
components/ui/           Primitives generados por shadcn/ui
lib/openapi/             Validación, lectura y transformación del contrato
openapi/                 Snapshot versionado de producción
scripts/                 Update/validate OpenAPI y scan del bundle
docs/                    Arquitectura, discrepancias y verificación
design-system/           Guía Vercel (vercel-design.md) y su aplicación (MASTER.md)
```

## Deploy en Vercel

1. Importa este repositorio como proyecto nuevo en Vercel.
2. Framework preset: Next.js.
3. Build command: `npm run build`.
4. Sin variables de entorno.
5. Valida un deploy de preview antes de promoverlo a producción.

### Dominio `developers.buscafondos.com`

Pendiente. Cuando se autorice:

1. agrega `developers.buscafondos.com` como dominio del proyecto en Vercel;
2. crea en el DNS el registro que Vercel indique;
3. espera la emisión del certificado TLS;
4. verifica canonical, sitemap, `robots.txt` y headers de seguridad en producción.

## Documentación del proyecto

- [Decisiones de arquitectura](docs/architecture.md)
- [Discrepancias entre documentación y contrato](docs/openapi-discrepancies.md)
- [Supuestos y trabajo pendiente](docs/assumptions-and-todo.md)
- [Resultado de verificación](docs/verification.md)

## Seguridad del playground

El playground lista únicamente `/health` y los GET del contrato protegidos por `X-Api-Key`. La key:

- vive en estado React, en memoria;
- no se agrega a la URL;
- no se guarda en cookies, `localStorage` ni `sessionStorage`;
- no pasa por un proxy ni por un servidor del portal;
- viaja directamente a la API en el header `X-Api-Key`;
- se elimina con el botón **Limpiar credencial** o al recargar o cerrar el tab.

El portal no incluye analytics.
