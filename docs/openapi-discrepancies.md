# Discrepancias observadas

Inspección realizada el 26 de agosto de 2026. Cuando hay diferencias, el snapshot OpenAPI de producción y el código de `cmf-api` prevalecen.

## Inventario escrito rezagado

`doc/api.md` enumera 13 endpoints GET. El snapshot descargado contiene 31 rutas y 33 operaciones. Entre las operaciones presentes en OpenAPI pero ausentes de los encabezados de `doc/api.md` están:

- `GET /api/real_assets/{asset_id}/expense_ratio/history`
- `GET /api/market-summary`
- `GET /api/families/{family_rar}/index`
- `GET /api/benchmarks`
- `GET /api/benchmarks/{family_rar}/prices`
- `GET /api/reports/tac-changes`
- `GET /api/key/info`
- rutas de cuenta bajo `/api/auth`, `/api/me` y `/api/alerts`

La documentación de cuenta está distribuida en otros archivos del backend; el punto aquí es que `doc/api.md` por sí solo no representa el contrato completo.

## Bearer no expresado como security scheme

`app/apikeys.py` acepta `Authorization: Bearer bf_…` y la política pública lo documenta. OpenAPI define sólo `X-Api-Key`, por lo que generadores de SDK no descubrirán Bearer automáticamente. El portal recomienda `X-Api-Key` y presenta Bearer como alternativa de runtime con esta advertencia.

## Errores del middleware ausentes de operaciones

La mayoría de las operaciones protegidas no declaran respuestas `401`, `429` o `503` en OpenAPI, aunque `ApiKeyMiddleware` las produce. El portal explica el comportamiento real en la guía de cuotas, pero la referencia generada no inventa esas respuestas dentro de cada operación.

## Schemas incompletos

Varias respuestas declaran `schema: {}` aunque incluyen ejemplos. Por eso la referencia muestra el ejemplo disponible y representa fielmente un schema vacío cuando corresponde. No se infieren campos desde la documentación narrativa.

## OpenAPI sólo representa X-Api-Key

Las operaciones de cuenta no llevan `X-Api-Key` porque usan su propio contrato (cookie/sesión). El playground las excluye deliberadamente; sólo ofrece `/health` y GET protegidos por el esquema de API pública.
