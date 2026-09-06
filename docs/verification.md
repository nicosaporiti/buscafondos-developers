# Verificación

Fecha: 6 de septiembre de 2026 (actualización del snapshot OpenAPI: rentabilidades, comparador y screener).

## Automatizada

| Comando | Resultado |
| --- | --- |
| `npm run openapi:validate` | PASS — 34 rutas, 36 operaciones |
| `npm run lint` | PASS — sin warnings |
| `npm run typecheck` | PASS — TypeScript strict |
| `npm test` | PASS — 10 archivos, 38 pruebas |
| `npm run build` | PASS — 13 rutas listadas como `○ Static`; 14 páginas estáticas generadas; fuentes Geist self-hosted |
| `npm run check:bundle-secrets` | PASS — 456 artefactos revisados, sin patrones de API key |

## Cobertura de pruebas

- navegación mínima y rutas únicas;
- conservación de operaciones/tags del snapshot;
- distinción entre `/health` público y endpoints con `X-Api-Key`;
- render de tags, endpoint y modelos reales de la referencia;
- construcción de URLs y encoding del playground;
- key solo en header, nunca en URL ni storage, y limpieza explícita;
- curl generado según método y body;
- renderizado de `requestBody` y query params requeridos;
- presencia de `/api/real_assets/{asset_id}/returns`, `/api/compare` y `/api/screener` con `X-Api-Key`, orden del tag declarado `Fund Returns` y conservación del tag no declarado `Reports`;
- tipos de parámetro resueltos (`string | null`, `$ref`), enums, defaults y hint numérico en referencia y playground;
- estado pendiente y `CopyButton`;
- esquema de seguridad, headings y breakpoint responsive;
- CSP con `unsafe-eval` limitada al entorno de desarrollo;
- contexto y nombre accesible del buscador dentro de `CommandDialog`.

## Visual

Revisión manual del build de producción en Chrome:

- desktop: home, quickstart, referencia y playground a 1440 px, sin overflow horizontal;
- móvil: home, quickstart, referencia y playground a 390 px, sin overflow horizontal;
- botón primario con texto visible en tema claro y oscuro; sidebar alineado bajo el header;
- sidebar trigger móvil expuesto como `Abrir navegación de documentación`;
- input de API key con label visible en el playground;
- tema claro y oscuro verificados;
- consola del home sin warnings ni errores;
- breakpoints intermedios revisados a 768 y 901 px.

Capturas:

- [Home desktop oscuro](../artifacts/screenshots/home-desktop-dark.png)
- [Home desktop claro](../artifacts/screenshots/home-desktop-light.png)
- [Quickstart desktop](../artifacts/screenshots/quickstart-desktop-dark.png)
- [Referencia desktop claro](../artifacts/screenshots/reference-desktop-light.png)
- [Playground desktop claro](../artifacts/screenshots/playground-desktop-light.png)
- [Home móvil](../artifacts/screenshots/home-mobile-dark.png)
- [Quickstart móvil](../artifacts/screenshots/quickstart-mobile-dark.png)
- [Referencia móvil](../artifacts/screenshots/reference-mobile-dark.png)
- [Playground móvil](../artifacts/screenshots/playground-mobile-dark.png)
