# Supuestos y trabajo pendiente

## Supuestos aplicados

- Español de Chile es el idioma inicial y único.
- `developers.buscafondos.com` será el canonical definitivo, aunque aún no exista DNS.
- El flujo oficial de keys permanece en `api.buscafondos.com/register`.
- El repositorio público confirmado para soporte técnico es `nicosaporiti/cmf-api`.
- No existe status page externa ni SLA confirmado.
- El snapshot OpenAPI de producción prevalece sobre inventarios manuales.
- Un proyecto mantenido por una persona se beneficia más de componentes locales y scripts directos que de un CMS o pipeline externo.

## Pendiente antes de producción

- Crear/importar el proyecto en Vercel y validar preview.
- Autorizar y configurar DNS de `developers.buscafondos.com`.
- Revisar CSP en preview si Vercel añade scripts operativos necesarios.
- Definir proceso de releases y frecuencia de actualización del snapshot.
- Confirmar canal de soporte definitivo si se quiere publicar algo distinto a GitHub/BuscaFondos.
- Añadir monitoreo de enlaces y accesibilidad automatizada en CI.
- Evaluar versionado de API antes de introducir cambios incompatibles.

## Futuro, fuera del alcance actual

- Login y dashboard de consumo.
- Rotación o revocación de keys desde el portal.
- SDKs generados.
- Analytics con política de privacidad y redacción de URLs.
- Búsqueda full-text indexada si el volumen de documentación lo exige.
