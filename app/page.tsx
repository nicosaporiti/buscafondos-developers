import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { CodeExample } from "@/components/code-example";
import { Button } from "@/components/ui/button";
import { openApiDocument } from "@/lib/openapi/document";
import { groupedOperations, isApiKeyProtected, listOperations } from "@/lib/openapi/operations";
import { siteConfig } from "@/lib/site";

const curlExample = `curl https://api.buscafondos.com/api/all-funds \\
  -H "X-Api-Key: $BUSCAFONDOS_API_KEY"`;

function tagAnchor(tag: string): string {
  return `/reference#tag-${tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

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
          <h1 id="home-title" className="display">Datos de fondos mutuos chilenos, listos para construir.</h1>
          <p className="lede">Valores cuota, costos, riesgo, carteras y estadísticas de administradoras desde una API mantenida con datos públicos de la CMF. Una key, un header, respuestas JSON.</p>
          <div className="actions">
            <Button asChild size="lg"><Link href={siteConfig.registerUrl}>Obtener API key</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/quickstart">Leer quickstart <ArrowIcon /></Link></Button>
          </div>
        </div>
        <div className="opening-proof span-5">
          <CodeExample code={curlExample} language="bash" title="Primer request" />
          <p className="caption">Los endpoints de datos exigen el header X-Api-Key. Solo /health es público.</p>
        </div>
      </section>

      <div className="container stat-strip" aria-label="Contrato publicado">
        <div className="stat"><p className="stat-label">Operaciones documentadas</p><p className="stat-value">{operations.length}</p><p className="stat-detail">en {routes} rutas del snapshot</p></div>
        <div className="stat"><p className="stat-label">GET con API key</p><p className="stat-value">{protectedGets}</p><p className="stat-detail">de {getOperations.length} operaciones GET</p></div>
        <div className="stat"><p className="stat-label">Modelos publicados</p><p className="stat-value">{models}</p><p className="stat-detail">schemas en components</p></div>
        <div className="stat"><p className="stat-label">Contrato</p><p className="stat-value">v{openApiDocument.info.version}</p><p className="stat-detail">OpenAPI {openApiDocument.openapi}</p></div>
      </div>

      <section className="home-section container" aria-labelledby="coverage-title">
        <div className="section-intro">
          <h2 id="coverage-title" className="heading-24">Qué expone el contrato</h2>
          <p>Las áreas y conteos salen del snapshot OpenAPI versionado en este repositorio, el mismo que genera la referencia.</p>
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
          <p>Tres pasos separan el registro de la primera respuesta con datos de producción.</p>
        </div>
        <ol className="steps">
          <li><h3 className="heading-16">Obtén una key gratuita</h3><p>El registro verifica tu email y muestra la key una sola vez. Guárdala en un gestor de secretos del servidor.</p><Link className="link-arrow" href="/api-keys">Emisión y consumo <ArrowIcon width={14} height={14} /></Link></li>
          <li><h3 className="heading-16">Envía el header X-Api-Key</h3><p>Es el único esquema de seguridad publicado en OpenAPI. Verifica la key con /api/key/info sin gastar cuota.</p><Link className="link-arrow" href="/authentication">Autenticación <ArrowIcon width={14} height={14} /></Link></li>
          <li><h3 className="heading-16">Lee cuota y errores en los headers</h3><p>Cada respuesta informa límite, remanente y reset. Reintenta 429 y 5xx respetando Retry-After.</p><Link className="link-arrow" href="/quotas-errors">Cuotas y errores <ArrowIcon width={14} height={14} /></Link></li>
        </ol>
      </section>

      <section className="home-closing container grid-12" aria-labelledby="contract-title">
        <div className="stack span-7">
          <h2 id="contract-title" className="heading-24">La referencia nace del backend, no de copias manuales.</h2>
          <p className="lede">El portal valida y genera la referencia y el playground desde un snapshot de <code className="mono">/openapi.json</code>. Los builds siguen siendo reproducibles aunque la API no esté disponible.</p>
          <div className="actions">
            <Button asChild size="lg"><Link href="/reference">Ver referencia API</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/playground">Abrir playground <ArrowIcon /></Link></Button>
          </div>
        </div>
      </section>
    </main>
  );
}
