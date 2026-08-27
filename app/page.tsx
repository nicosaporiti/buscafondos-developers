import Link from "next/link";
import { ArrowIcon, DatabaseIcon, ExternalIcon, KeyIcon, ShieldIcon, TerminalIcon } from "@/components/icons";
import { CodeExample } from "@/components/code-example";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { openApiDocument } from "@/lib/openapi/document";
import { siteConfig } from "@/lib/site";

const curlExample = `curl https://api.buscafondos.com/api/all-funds \\
  -H "X-Api-Key: $BUSCAFONDOS_API_KEY"`;

export default function HomePage() {
  const protectedGets = Object.values(openApiDocument.paths).filter((item) => item.get?.security?.some((entry) => "X-Api-Key" in entry)).length;

  return (
    <main id="main-content" className="home-main">
      <section className="home-hero">
        <div className="hero-copy">
          <Badge variant="outline" className="eyebrow"><span className="status-dot" /> API pública · OpenAPI {openApiDocument.info.version}</Badge>
          <h1>Datos de fondos mutuos chilenos, listos para construir.</h1>
          <p>Consulta valores cuota, costos, riesgo, carteras y estadísticas de administradoras desde una API mantenida con datos públicos de la CMF.</p>
          <div className="hero-actions">
            <Button asChild size="lg"><Link href={siteConfig.registerUrl}><KeyIcon /> Obtener API key</Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/quickstart">Leer quickstart <ArrowIcon /></Link></Button>
          </div>
          <div className="hero-proof" aria-label="Resumen de la API">
            <span><strong>{protectedGets}</strong> endpoints GET con key</span>
            <span><strong>6+</strong> años de datos</span>
            <span><strong>JSON</strong> respuestas estructuradas</span>
          </div>
        </div>
        <div className="hero-code">
          <div className="terminal-bar"><span /><span /><span /><small>primer-request.sh</small></div>
          <CodeExample code={curlExample} language="bash" title="Terminal" />
          <div className="terminal-response"><span>200 OK</span><span>X-RateLimit-Remaining: 999</span><span>82 ms</span></div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="cases-title">
        <div className="section-heading"><span>Casos de uso</span><h2 id="cases-title">Una capa de datos para productos financieros locales</h2><p>Integra la profundidad del mercado chileno sin mantener scrapers ni normalizar planillas por tu cuenta.</p></div>
        <div className="use-case-grid">
          <Card><CardHeader><DatabaseIcon /><CardTitle asChild><h3>Exploradores de fondos</h3></CardTitle><CardDescription>Catálogos, series, valores cuota, TAC y clasificaciones para buscadores y comparadores.</CardDescription></CardHeader><CardContent><Link href="/reference">Explorar endpoints <ArrowIcon /></Link></CardContent></Card>
          <Card><CardHeader><TerminalIcon /><CardTitle asChild><h3>Análisis cuantitativo</h3></CardTitle><CardDescription>Históricos, riesgo, benchmarks e índices de familias para modelos y herramientas internas.</CardDescription></CardHeader><CardContent><Link href="/playground">Abrir playground <ArrowIcon /></Link></CardContent></Card>
          <Card><CardHeader><ShieldIcon /><CardTitle asChild><h3>Monitoreo de mercado</h3></CardTitle><CardDescription>Patrimonio, partícipes, rankings AGF, cambios de TAC y composición de carteras.</CardDescription></CardHeader><CardContent><Link href="/authentication">Revisar autenticación <ArrowIcon /></Link></CardContent></Card>
        </div>
      </section>

      <section className="home-section contract-band" aria-labelledby="contract-title">
        <div><span>Contrato versionado</span><h2 id="contract-title">La referencia nace del backend, no de copias manuales.</h2><p>El portal valida y genera la referencia desde un snapshot de <code>/openapi.json</code>. Los builds siguen siendo reproducibles aunque la API no esté disponible.</p></div>
        <Button asChild variant="secondary"><Link href="/reference">Ver referencia API <ArrowIcon /></Link></Button>
      </section>

      <section className="home-cta" aria-labelledby="cta-title">
        <span>Empieza en minutos</span><h2 id="cta-title">Una key. Un header. Datos reales.</h2><p>La key gratuita se muestra una sola vez. Guárdala en un gestor de secretos y haz tu primer request desde el backend.</p>
        <div><Button asChild size="lg"><Link href={siteConfig.registerUrl}>Obtener API key <ArrowIcon /></Link></Button><Link className="text-link" href={siteConfig.productUrl}>Volver a BuscaFondos <ExternalIcon /></Link></div>
      </section>
    </main>
  );
}
