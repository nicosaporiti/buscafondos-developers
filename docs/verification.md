# Verificación

Fecha: 27 de agosto de 2026.

## Automatizada

| Comando | Resultado |
| --- | --- |
| `npm run openapi:validate` | PASS — 31 rutas, 33 operaciones |
| `npm run lint` | PASS — sin warnings |
| `npm run typecheck` | PASS — TypeScript strict |
| `npm test` | PASS — 10 archivos, 29 pruebas |
| `npm run build` | PASS — 13 rutas listadas como `○ Static`; 14 páginas estáticas generadas |
| `npm run check:bundle-secrets` | PASS — 302 artefactos revisados, sin patrones de API key |

## Cobertura de pruebas

- navegación mínima y rutas únicas;
- conservación de operaciones/tags del snapshot;
- distinción entre `/health` público y endpoints con `X-Api-Key`;
- render de tags, endpoint y modelos reales de la referencia;
- construcción de URLs y encoding del playground;
- key sólo en header, nunca URL/storage, y limpieza explícita.
- curl generado según método y body;
- renderizado de `requestBody` y query params requeridos;
- estado pendiente y `CopyButton`;
- esquema de seguridad, headings y breakpoint responsive;
- CSP con `unsafe-eval` limitada al entorno de desarrollo;
- contexto y nombre accesible del buscador dentro de `CommandDialog`.

## Visual

Revisión real del build de producción con Chrome:

- desktop: home, quickstart, referencia y playground a 1512 px, sin overflow horizontal;
- móvil: home, quickstart, referencia y playground a 390 px, sin overflow horizontal;
- sidebar trigger móvil expuesto como `Abrir navegación de documentación`;
- input de API key con label visible en el playground;
- tema claro y oscuro verificados;
- consola del home sin warnings ni errores.
- verificación responsive ejecutada en este ciclo a 768 y 901 px.

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
