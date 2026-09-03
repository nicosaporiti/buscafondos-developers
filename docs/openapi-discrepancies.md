# Discrepancias observadas

Inspección realizada el 26 de agosto de 2026. Cuando hay diferencias, el snapshot OpenAPI de producción y el comportamiento observado de la API prevalecen.

## Inventario escrito rezagado

El inventario narrativo previo enumera 13 endpoints GET. El snapshot descargado contiene 31 rutas y 33 operaciones. Entre las operaciones presentes en OpenAPI pero ausentes de ese inventario están:

- `GET /api/real_assets/{asset_id}/expense_ratio/history`
- `GET /api/market-summary`
- `GET /api/families/{family_rar}/index`
- `GET /api/benchmarks`
- `GET /api/benchmarks/{family_rar}/prices`
- `GET /api/reports/tac-changes`
- `GET /api/key/info`
- rutas de cuenta bajo `/api/auth`, `/api/me` y `/api/alerts`

El inventario narrativo por sí solo no representa el contrato completo; el snapshot OpenAPI es la fuente de verdad.

## Bearer no expresado como security scheme

La API acepta `Authorization: Bearer bf_…` y la política pública lo documenta. OpenAPI define solo `X-Api-Key`, por lo que los generadores de SDK no descubrirán Bearer. El portal recomienda `X-Api-Key` y presenta Bearer como alternativa de runtime con esta advertencia.

## Errores del middleware ausentes de operaciones

La mayoría de las operaciones protegidas no declaran respuestas `401`, `429` o `503` en OpenAPI, aunque la API las produce. El portal documenta ese comportamiento en la guía de cuotas; la referencia generada no agrega respuestas que el contrato no declara.

## Schemas incompletos

Varias respuestas declaran `schema: {}` aunque incluyen ejemplos. La referencia muestra el ejemplo disponible y el schema vacío tal como está. No se infieren campos desde la documentación narrativa.

## OpenAPI solo representa X-Api-Key

Las operaciones de cuenta no llevan `X-Api-Key` porque usan su propio contrato (cookie/sesión). El playground las excluye; ofrece solo `/health` y los GET protegidos por el esquema de API pública.
