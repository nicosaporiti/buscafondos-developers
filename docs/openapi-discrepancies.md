# Discrepancias observadas

Inspección inicial el 26 de agosto de 2026; snapshot actualizado el 6 de septiembre de 2026. Cuando hay diferencias, el snapshot OpenAPI de producción y el comportamiento observado de la API prevalecen.

## Inventario escrito rezagado

El inventario narrativo previo enumera 13 endpoints GET. El snapshot del 6 de septiembre de 2026 contiene 34 rutas y 36 operaciones (el del 26 de agosto tenía 31 y 33). Entre las operaciones presentes en OpenAPI pero ausentes de ese inventario están:

- `GET /api/real_assets/{asset_id}/expense_ratio/history`
- `GET /api/market-summary`
- `GET /api/families/{family_rar}/index`
- `GET /api/benchmarks`
- `GET /api/benchmarks/{family_rar}/prices`
- `GET /api/reports/tac-changes`
- `GET /api/key/info`
- rutas de cuenta bajo `/api/auth`, `/api/me` y `/api/alerts`
- desde el 6 de septiembre de 2026: `GET /api/real_assets/{asset_id}/returns`, `GET /api/compare` y `GET /api/screener`

El inventario narrativo por sí solo no representa el contrato completo; el snapshot OpenAPI es la fuente de verdad.

## Bearer no expresado como security scheme

La API acepta `Authorization: Bearer bf_…` y la política pública lo documenta. OpenAPI define solo `X-Api-Key`, por lo que los generadores de SDK no descubrirán Bearer. El portal recomienda `X-Api-Key` y presenta Bearer como alternativa de runtime con esta advertencia.

## Errores del middleware ausentes de operaciones

La mayoría de las operaciones protegidas no declaran respuestas `401`, `429` o `503` en OpenAPI, aunque la API las produce. El portal documenta ese comportamiento en la guía de cuotas; la referencia generada no agrega respuestas que el contrato no declara.

## Schemas incompletos

Varias respuestas declaran `schema: {}` aunque incluyen ejemplos. La referencia muestra el ejemplo disponible y el schema vacío tal como está. No se infieren campos desde la documentación narrativa.

## OpenAPI solo representa X-Api-Key

Las operaciones de cuenta no llevan `X-Api-Key` porque usan su propio contrato (cookie/sesión). El playground las excluye; ofrece solo `/health` y los GET protegidos por el esquema de API pública.

## Tag `Reports` no declarado

`GET /api/reports/tac-changes` lleva el tag `Reports`, que la lista `tags` del documento no incluye. `groupedOperations` conserva la operación y agrupa los tags no declarados después de los declarados, sin descripción; el home muestra "Sin descripción en el contrato." para esa área. `Fund Returns` tuvo el mismo problema en la primera publicación del 6 de septiembre de 2026 y el backend lo corrigió el mismo día.

## Respuestas `503` declaradas parcialmente

`GET /api/all-funds`, `GET /api/real_assets/{asset_id}/returns`, `GET /api/compare` y `GET /api/screener` declaran `503`; el resto de las operaciones protegidas siguen sin declararlo aunque el middleware puede producirlo. La guía de cuotas describe el comportamiento general.

## Campos de `/api/all-funds` sin schema

Desde el 2 de octubre de 2026, `GET /api/all-funds` incluye `price_as_of_date` y `seriesContinuity` en cada fila. El `200` sigue declarando `schema: {}` y el ejemplo publicado no muestra esos campos. El changelog los describe; la referencia generada no los infiere. `SeriesContinuity` sí está declarado como modelo porque lo usa `MarketAttributes` (`/api/compare` y `/api/screener`).

## Límites por tier fuera del contrato

OpenAPI no declara las cuotas por tier (`free`, `institutional`, `internal`) ni el límite por IP. El portal las documenta en la guía de cuotas a partir de la política de uso y de la configuración del backend vigente desde el 1 de octubre de 2026 (`free` = 300 requests/día). Las keys pueden tener cuotas asignadas distintas; la fuente autoritativa para cada key es `X-RateLimit-Limit` o `GET /api/key/info`.
