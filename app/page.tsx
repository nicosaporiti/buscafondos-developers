import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { CodeExample } from "@/components/code-example";
import { Button } from "@/components/ui/button";
import { openApiDocument } from "@/lib/openapi/document";
import { groupedOperations, isApiKeyProtected, listOperations, operationAnchor } from "@/lib/openapi/operations";
import { siteConfig } from "@/lib/site";

const curlExample = `curl https://api.buscafondos.com/api/all-funds \\
  -H "X-Api-Key: $BUSCAFONDOS_API_KEY"`;

function tagAnchor(tag: string): string {
  return `/reference#tag-${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

const useCases = [
  {
    audience: "Programadores y equipos de producto",
    title: "Aplicaciones para inversionistas",
    text: "Comparadores, alertas de precio, simuladores de ahorro y paneles de seguimiento con valores cuota diarios y variaciones del mercado.",
    paths: ["/api/all-funds", "/api/real_assets/{asset_id}/days", "/api/market-summary"],
  },
  {
    audience: "Analistas y gestores de inversión",
    title: "Análisis de carteras",
    text: "Composición por tipo de instrumento, holdings ordenados por peso y métricas de riesgo de cada serie para revisar exposición y concentración.",
    paths: ["/api/funds/{run}/cartera/resumen", "/api/funds/{run}/cartera/holdings", "/api/real_assets/{asset_id}/risk_metrics"],
  },
  {
    audience: "Asesores de inversión",
    title: "Selección y comparación de fondos",
    text: "Screener del universo publicado, comparación de hasta diez series en un mismo corte, rentabilidades por ventana, TAC y declaración del artículo 107 para justificar una recomendación.",
    paths: ["/api/screener", "/api/compare", "/api/real_assets/{asset_id}/returns", "/api/real_assets/{asset_id}/expense_ratio", "/api/funds/{run}/article107"],
  },
  {
    audience: "Investigación y reportes",
    title: "Estudios de industria",
    text: "Ranking y evolución mensual de patrimonio y partícipes por administradora, más los fondos que más cambiaron su TAC mes a mes.",
    paths: ["/api/agf_stats/ranking", "/api/agf_stats/evolution", "/api/reports/tac-changes"],
  },
] as const;

function plainSummary(description: string | undefined): string | undefined {
  const line = description?.split("\n").map((item) => item.trim()).find((item) => item !== "" && !item.startsWith("#"));
  return line?.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*]/g, "");
}

export default function HomePage() {
  const operations = listOperations(openApiDocument);
  const getOperations = operations.filter((item) => item.method === "get");
  const protectedGets = getOperations.filter((item) => isApiKeyProtected(item.operation)).length;
  const models = Object.keys(openApiDocument.components?.schemas ?? {}).length;
  const routes = Object.keys(openApiDocument.paths).length;
  const groups = groupedOperations(openApiDocument);

  return (
    <main id="main-content">
      <section className="home-opening container grid-12" aria-labelledby="home-title">
        <div className="opening-claim span-7">
          <h1 id="home-title" className="display">API de fondos mutuos chilenos.</h1>
          <p className="lede">Valores cuota diarios, TAC, métricas de riesgo, carteras y estadísticas de administradoras, construidos a partir de la información pública de la CMF. Autenticación por header, respuestas JSON.</p>
          <div className="actions">
            <Button asChild size="lg"><Link href={siteConfig.registerUrl}>Obtener API key</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/quickstart">Leer quickstart <ArrowIcon /></Link></Button>
          </div>
        </div>
        <div className="opening-proof span-5">
          <CodeExample code={curlExample} language="bash" title="Primer request" />
          <p className="caption">Los endpoints de datos requieren el header X-Api-Key. Solo /health es público.</p>
        </div>
      </section>

      <div className="container stat-strip" aria-label="Contrato publicado">
        <div className="stat"><p className="stat-label">Operaciones documentadas</p><p className="stat-value">{operations.length}</p><p className="stat-detail">en {routes} rutas del snapshot</p></div>
        <div className="stat"><p className="stat-label">GET con API key</p><p className="stat-value">{protectedGets}</p><p className="stat-detail">de {getOperations.length} operaciones GET</p></div>
        <div className="stat"><p className="stat-label">Modelos publicados</p><p className="stat-value">{models}</p><p className="stat-detail">schemas en components</p></div>
        <div className="stat"><p className="stat-label">Contrato</p><p className="stat-value">v{openApiDocument.info.version}</p><p className="stat-detail">OpenAPI {openApiDocument.openapi}</p></div>
      </div>

      <section className="home-section home-use-cases container grid-12" aria-labelledby="use-cases-title">
        <div className="use-cases-intro span-4">
          <h2 id="use-cases-title" className="heading-24">Qué se construye con la API</h2>
          <p>Los mismos endpoints sirven a quien programa un producto y a quien analiza fondos. Cada caso enlaza a las operaciones que usa.</p>
          <div className="actions">
            <Button asChild size="lg"><Link href={siteConfig.registerUrl}>Obtener API key</Link></Button>
          </div>
        </div>
        <ul className="use-cases span-8">
          {useCases.map((useCase) => (
            <li key={useCase.title}>
              <p className="use-case-audience">{useCase.audience}</p>
              <h3 className="heading-16">{useCase.title}</h3>
              <p>{useCase.text}</p>
              <p className="use-case-paths">
                {useCase.paths.map((path) => <Link key={path} href={`/reference#${operationAnchor("get", path)}`}><code>{path}</code></Link>)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="home-section container" aria-labelledby="coverage-title">
        <div className="section-intro">
          <h2 id="coverage-title" className="heading-24">Qué expone el contrato</h2>
          <p>Áreas y conteos se leen del snapshot OpenAPI versionado en el repositorio, el mismo del que se genera la referencia.</p>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <caption className="visually-hidden">Áreas del contrato OpenAPI con su descripción y número de operaciones</caption>
            <thead><tr><th scope="col">Área</th><th scope="col">Descripción</th><th scope="col" className="numeric">Operaciones</th></tr></thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.tag}>
                  <th scope="row"><Link href={tagAnchor(group.tag)}>{group.tag}</Link></th>
                  <td>{plainSummary(group.description) ?? "Sin descripción en el contrato."}</td>
                  <td className="numeric">{group.operations.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="home-section container" aria-labelledby="start-title">
        <div className="section-intro">
          <h2 id="start-title" className="heading-24">Cómo empezar</h2>
          <p>Registro, autenticación y manejo de cuota. Cada paso enlaza a su guía.</p>
        </div>
        <ol className="steps">
          <li><h3 className="heading-16">Obtén una key gratuita</h3><p>El registro verifica tu email y muestra la key una sola vez. El tier free permite 300 requests al día; para más, escribe a api@buscafondos.com.</p><Link className="link-arrow" href="/api-keys">Emisión y consumo <ArrowIcon width={14} height={14} /></Link></li>
          <li><h3 className="heading-16">Envía el header X-Api-Key</h3><p>Es el único security scheme declarado en OpenAPI. Verifica la key con /api/key/info; esa llamada no descuenta cuota.</p><Link className="link-arrow" href="/authentication">Autenticación <ArrowIcon width={14} height={14} /></Link></li>
          <li><h3 className="heading-16">Lee la cuota en los headers</h3><p>Cada respuesta informa límite, remanente y timestamp de reset. Reintenta 429 y 5xx respetando Retry-After.</p><Link className="link-arrow" href="/quotas-errors">Cuotas y errores <ArrowIcon width={14} height={14} /></Link></li>
        </ol>
      </section>

      <section className="home-closing container grid-12" aria-labelledby="contract-title">
        <div className="stack span-7">
          <h2 id="contract-title" className="heading-24">La referencia se genera desde el contrato OpenAPI del backend.</h2>
          <p className="lede">El portal versiona un snapshot de <code className="mono">/openapi.json</code>, lo valida en cada build y produce desde él la referencia y el playground. El build no depende de que la API esté disponible.</p>
          <div className="actions">
            <Button asChild size="lg"><Link href="/reference">Ver referencia API</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/playground">Abrir playground <ArrowIcon /></Link></Button>
          </div>
        </div>
      </section>
    </main>
  );
}
