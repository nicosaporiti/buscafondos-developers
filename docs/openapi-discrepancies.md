# Discrepancias observadas

Inspección inicial el 26 de agosto de 2026; snapshot actualizado el 11 de octubre de 2026. Cuando hay diferencias, el snapshot OpenAPI de producción y el comportamiento observado de la API prevalecen.

## Inventario escrito rezagado

El inventario narrativo previo enumera 13 endpoints GET. El snapshot del 11 de octubre de 2026 contiene 39 rutas y 41 operaciones (el del 6 de septiembre tenía 34 y 36; el del 26 de agosto, 31 y 33). Entre las operaciones presentes en OpenAPI pero ausentes de ese inventario están:

- `GET /api/real_assets/{asset_id}/expense_ratio/history`
- `GET /api/market-summary`
- `GET /api/families/{family_rar}/index`
- `GET /api/benchmarks`
- `GET /api/benchmarks/{family_rar}/prices`
- `GET /api/reports/tac-changes`
- `GET /api/key/info`
- rutas de cuenta bajo `/api/auth`, `/api/me` y `/api/alerts`
- desde el 6 de septiembre de 2026: `GET /api/real_assets/{asset_id}/returns`, `GET /api/compare` y `GET /api/screener`
- desde el 8 de octubre de 2026: las cinco rutas `GET /api/fi/instruments…` de fondos de inversión y ETF

El inventario narrativo por sí solo no representa el contrato completo; el snapshot OpenAPI es la fuente de verdad.

## Bearer no expresado como security scheme

La API acepta `Authorization: Bearer bf_…` y la política pública lo documenta. OpenAPI define solo `X-Api-Key`, por lo que los generadores de SDK no descubrirán Bearer. El portal recomienda `X-Api-Key` y presenta Bearer como alternativa de runtime con esta advertencia.

## Errores del middleware ausentes de operaciones

La mayoría de las operaciones protegidas no declaran respuestas `401`, `429` o `503` en OpenAPI, aunque la API las produce. El portal documenta ese comportamiento en la guía de cuotas; la referencia generada no agrega respuestas que el contrato no declara.

## Schemas incompletos

Varias respuestas declaran `schema: {}` aunque incluyen ejemplos. La referencia muestra el ejemplo disponible y el schema vacío tal como está. No se infieren campos desde la documentación narrativa.

## OpenAPI solo representa X-Api-Key

Las operaciones de cuenta no llevan `X-Api-Key` porque usan su propio contrato (cookie/sesión). El playground las excluye; ofrece solo `/health` y los GET protegidos por el esquema de API pública.

## Tags `Reports` e `Investment Funds` no declarados

`GET /api/reports/tac-changes` lleva el tag `Reports`, que la lista `tags` del documento no incluye. `groupedOperations` conserva la operación y agrupa los tags no declarados después de los declarados, sin descripción; el home muestra "Sin descripción en el contrato." para esa área. `Fund Returns` tuvo el mismo problema en la primera publicación del 6 de septiembre de 2026 y el backend lo corrigió el mismo día.

Desde el 8 de octubre de 2026 ocurre lo mismo con las cinco rutas `/api/fi/instruments…`, que llevan el tag `Investment Funds`. El home las muestra en esa área con "Sin descripción en el contrato." hasta que el backend declare el tag.

## Respuestas `503` declaradas parcialmente

`GET /api/all-funds`, `GET /api/real_assets/{asset_id}/returns`, `GET /api/compare` y `GET /api/screener` declaran `503`; el resto de las operaciones protegidas siguen sin declararlo aunque el middleware puede producirlo. La guía de cuotas describe el comportamiento general.

## Campos de `/api/all-funds` sin schema

Desde el 2 de octubre de 2026, `GET /api/all-funds` incluye `price_as_of_date` y `seriesContinuity` en cada fila. El `200` sigue declarando `schema: {}` y el ejemplo publicado no muestra esos campos. El changelog los describe; la referencia generada no los infiere. `SeriesContinuity` sí está declarado como modelo porque lo usa `MarketAttributes` (`/api/compare` y `/api/screener`).

## Límites por tier fuera del contrato

OpenAPI no declara las cuotas por tier (`free`, `institutional`, `internal`) ni el límite por IP. El portal las documenta en la guía de cuotas a partir de la política de uso y de la configuración del backend vigente desde el 1 de octubre de 2026 (`free` = 300 requests/día). Las keys pueden tener cuotas asignadas distintas; la fuente autoritativa para cada key es `X-RateLimit-Limit` o `GET /api/key/info`.

## Rutas de fondos de inversión sin schema ni ejemplo

Las cinco operaciones `GET /api/fi/instruments…` declaran `200` con `schema: {}` y sin ejemplo, a diferencia de `/api/all-funds`, que al menos publica un ejemplo. Tampoco declaran el `404` de instrumento no publicado, el `400` de `month` mal formado en las rutas de cartera ni el `503` que producen cuando el servicio de fondos de inversión no está disponible. Los `422` del rango de fechas invertido en `/prices` y de `return_basis=total` en `/returns` devuelven `{"detail": "…"}` como texto, no el `HTTPValidationError` declarado. Sus respuestas usan `data` y `meta`, pero no siguen JSON:API de forma uniforme: catálogo, detalle y precios entregan objetos planos (el catálogo con `id`, sin `type` ni `attributes`), y las rutas de cartera entregan `type` y `attributes` sin `id`. El changelog del 8 de octubre de 2026 describe los campos a partir del código del backend; la referencia generada no los infiere.

## Variantes de `/api/all-funds` por vehículo sin schema

`vehicle` está declarado como parámetro, pero las filas de ETF y fondos de inversión (`serieId` UUID, `ticker`, `price_source`, `price_basis`, `price_status`, `series_status`, `patrimony_as_of_date`, `risk_unavailable_reason`) y los campos de `meta` con `vehicle=all` (`etfAgfCount`, `investmentFundAgfCount`, `datesByVehicle`) no aparecen en el contrato. El ejemplo publicado solo agrega `vehicle: "mutual_fund"` a la fila de fondo mutuo.

## `503` de `scope=all` sin declarar

`GET /api/asset_providers` declara `200` y `422`. Con `scope=all` también puede responder `503` cuando el servicio de fondos de inversión no está disponible; ese código no figura en el contrato.

## `asset_id` como string

Las cinco rutas `/api/real_assets/{asset_id}/*` declaran desde el 8 de octubre de 2026 `asset_id` como `string` con un `pattern` que acepta un número de hasta 10 dígitos o un UUID. Antes era `integer` (en `/returns`, con rango 0 a 4.294.967.295). El `pattern` admite hasta 9.999.999.999, pero `/returns` sigue rechazando con `422` los valores sobre 4.294.967.295 y las demás rutas responden `404`. El playground ya no sugiere teclado numérico para ese parámetro.

## Descripción de `/api/all-funds` en inglés

Desde el 8 de octubre de 2026 la descripción de `GET /api/all-funds` en OpenAPI está en inglés y describe detalles de implementación ("FM by default; … materialized offline"). La referencia la muestra tal como viene del contrato. Corresponde pedir al backend una descripción pública en español.

## `Cache-Control` en respuestas autenticadas

Las respuestas autenticadas, incluidas las de `/api/fi/*`, llevan `Cache-Control: private, no-store, max-age=0`. El contrato no lo declara.
