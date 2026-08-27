# BuscaFondos Developers

Portal independiente de documentación y onboarding para la API pública de fondos mutuos chilenos de [BuscaFondos](https://www.buscafondos.com).

- Portal previsto: `https://developers.buscafondos.com`
- API: `https://api.buscafondos.com`
- Backend fuente de verdad: [`nicosaporiti/cmf-api`](https://github.com/nicosaporiti/cmf-api)

Este proyecto no forma parte de `cmf-api` ni de `agfapp`. Ambos se usaron sólo como referencia y no se modifican desde este repositorio.

## Requisitos

- Node.js 20.9 o superior
- npm 10 o superior

No se requieren variables de entorno para desarrollar o construir el portal. No agregues API keys al repositorio ni a variables `NEXT_PUBLIC_*`.

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abre `http://localhost:3000`. El contenido y la referencia son locales; únicamente el playground hace requests directos desde el navegador a `api.buscafondos.com` cuando el usuario los inicia.

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

`check:bundle-secrets` revisa los artefactos `.next` y falla si encuentra un patrón de API key `bf_…`. Es una defensa adicional, no reemplaza una revisión de secretos del repositorio.

## Actualizar OpenAPI

El contrato tiene una única fuente de verdad: `cmf-api`. El portal versiona un snapshot para que los builds no dependan de producción.

```bash
npm run openapi:update
npm run openapi:validate
npm test
```

El primer comando descarga `https://api.buscafondos.com/openapi.json`, valida OpenAPI 3.x y el esquema `X-Api-Key`, y sobrescribe `openapi/buscafondos.openapi.json` con JSON estable. Revisa el diff antes de publicar. La referencia y el playground se regeneran desde ese archivo durante el build; no copies endpoints manualmente a MDX.

## shadcn/ui y diseño

El proyecto fue inicializado con el CLI oficial de shadcn/ui v4 usando Radix, preset Nova y Tailwind CSS v4. Los componentes viven en `components/ui` y la configuración en `components.json`.

```bash
npx shadcn@latest info
npx shadcn@latest add <componente>
```

shadcn es la base de primitives, no la identidad visual final. Los tokens en `app/globals.css` reemplazan el tema default con Signal Blue, slate, superficies y estados de BuscaFondos; la tipografía local es IBM Plex Sans + JetBrains Mono. Conserva labels explícitos, foco visible, targets accesibles y los textos en español al agregar componentes.

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
design-system/           Decisiones visuales persistidas
```

## Deploy en Vercel

1. Importa **este repositorio** como un proyecto nuevo en Vercel.
2. Framework preset: Next.js.
3. Build command: `npm run build`.
4. No configures variables de entorno para el portal actual.
5. Haz un deploy de preview y ejecuta QA antes de promoverlo.

No se ha realizado ningún deploy desde este repositorio.

### Configuración futura de `developers.buscafondos.com`

Cuando exista autorización operativa:

1. agrega `developers.buscafondos.com` como dominio del proyecto en Vercel;
2. configura en el proveedor DNS el registro que Vercel indique;
3. espera validación TLS;
4. verifica canonical, sitemap, `robots.txt` y headers en producción.

Este procedimiento no se ejecutó: no se cambiaron DNS ni servicios externos.

## Documentación del proyecto

- [Decisiones de arquitectura](docs/architecture.md)
- [Discrepancias entre documentación y contrato](docs/openapi-discrepancies.md)
- [Supuestos y trabajo pendiente](docs/assumptions-and-todo.md)
- [Resultado de verificación](docs/verification.md)

## Seguridad del playground

El playground sólo lista GET del contrato protegidos por `X-Api-Key` y `/health`. La key:

- vive únicamente en estado React en memoria;
- nunca se agrega a la URL;
- no se guarda en cookies, `localStorage` ni `sessionStorage`;
- no se envía a un proxy o servidor del portal;
- se transmite directamente a la API en `X-Api-Key`;
- se elimina con el botón **Limpiar credencial** o al recargar/cerrar el tab.

El portal no incluye analytics.
