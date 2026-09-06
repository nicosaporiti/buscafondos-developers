import { CodeExample } from "./code-example";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { openApiDocument } from "@/lib/openapi/document";
import { accessLabel, curlExample, groupedOperations, operationAnchor, parameterDefault, parameterOptions, parameterType } from "@/lib/openapi/operations";
import type { OpenApiOperation, OpenApiParameter } from "@/lib/openapi/schema";
import { OpenApiMarkdown } from "./openapi-markdown";

function JsonSchema({ value }: { readonly value: unknown }) {
  return <CodeExample language="json" title="Schema" code={JSON.stringify(value, null, 2)} />;
}

function firstContent(response: { readonly content?: Readonly<Record<string, { readonly schema?: Readonly<Record<string, unknown>>; readonly example?: unknown }>> }) {
  const entry = Object.entries(response.content ?? {})[0];
  return entry ? { mediaType: entry[0], body: entry[1] } : undefined;
}

function RequestBody({ body }: { readonly body: NonNullable<OpenApiOperation["requestBody"]> }) {
  return (
    <div className="request-body-section">
      <h4>Cuerpo del request</h4>
      {body.description ? <OpenApiMarkdown source={body.description} parentHeadingLevel={4} /> : null}
      {Object.entries(body.content).map(([mediaType, content]) => (
        <div key={mediaType}>
          <p className="media-type">{mediaType} <small>{body.required ? "requerido" : "opcional"}</small></p>
          {content.example !== undefined ? <CodeExample language="json" title="Ejemplo" code={JSON.stringify(content.example, null, 2)} /> : content.schema ? <JsonSchema value={content.schema} /> : <p>Sin schema declarado.</p>}
        </div>
      ))}
    </div>
  );
}

function ParameterRow({ parameter }: { readonly parameter: OpenApiParameter }) {
  const options = parameterOptions(parameter.schema, openApiDocument);
  const defaultValue = parameterDefault(parameter.schema);
  return (
    <tr>
      <td><code>{parameter.name}</code>{parameter.required ? <small>requerido</small> : null}</td>
      <td>{parameter.in}</td>
      <td><code>{parameterType(parameter.schema)}</code>{options ? <small className="parameter-options">{options.map((option) => <code key={option}>{option}</code>)}</small> : null}</td>
      <td>{parameter.description ?? "Sin descripción."}{defaultValue !== undefined ? <small className="parameter-default">Por defecto: <code>{defaultValue}</code></small> : null}</td>
    </tr>
  );
}

export function ApiReference() {
  const groups = groupedOperations(openApiDocument);
  const models = openApiDocument.components?.schemas ?? {};

  return (
    <div className="api-reference-layout">
      <nav className="tag-navigation" aria-label="Áreas de la API">
        <span>Áreas</span>
        {groups.map((group) => <a key={group.tag} href={`#tag-${group.tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{group.tag}<small>{group.operations.length}</small></a>)}
        <a href="#models">Modelos<small>{Object.keys(models).length}</small></a>
      </nav>
      <div className="reference-content">
        {groups.map((group) => (
          <section className="reference-tag" key={group.tag} id={`tag-${group.tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
            <header><h2>{group.tag}</h2>{group.description ? <OpenApiMarkdown source={group.description} parentHeadingLevel={2} /> : null}</header>
            {group.operations.map((documented) => {
              const { method, path, operation, parameters } = documented;
              const access = accessLabel(path, operation);
              return (
                <article className="operation" key={`${method}-${path}`} id={operationAnchor(method, path)}>
                  <div className="operation-heading">
                    <span className="method" data-method={method}>{method.toUpperCase()}</span>
                    <code>{path}</code>
                    <span className="access">{access}</span>
                  </div>
                  <h3>{operation.summary ?? operation.operationId ?? path}</h3>
                  {operation.description ? <OpenApiMarkdown source={operation.description} parentHeadingLevel={3} /> : null}
                  {parameters.length > 0 ? (
                    <div className="parameter-section"><h4>Parámetros</h4><div className="table-scroll"><table><thead><tr><th scope="col">Nombre</th><th scope="col">Ubicación</th><th scope="col">Tipo</th><th scope="col">Descripción</th></tr></thead><tbody>{parameters.map((parameter) => <ParameterRow key={`${parameter.in}-${parameter.name}`} parameter={parameter} />)}</tbody></table></div></div>
                  ) : null}
                  {operation.requestBody ? <RequestBody body={operation.requestBody} /> : null}
                  <CodeExample title="curl" language="bash" code={curlExample(documented)} />
                  <div className="response-section"><h4>Respuestas</h4>
                    <Accordion type="multiple">
                      {Object.entries(operation.responses).map(([status, response]) => {
                        const content = firstContent(response);
                        return <AccordionItem value={status} key={status}><AccordionTrigger headingLevel="h5"><span><span className="status-code">{status}</span> {response.description}</span></AccordionTrigger><AccordionContent>{content ? <><p className="media-type">{content.mediaType}</p>{content.body.example !== undefined ? <CodeExample language="json" title="Ejemplo" code={JSON.stringify(content.body.example, null, 2)} /> : content.body.schema ? <JsonSchema value={content.body.schema} /> : <p>Sin schema declarado.</p>}</> : <p>Sin cuerpo de respuesta declarado.</p>}</AccordionContent></AccordionItem>;
                      })}
                    </Accordion>
                  </div>
                </article>
              );
            })}
          </section>
        ))}
        <section className="reference-tag" id="models"><header><h2>Modelos</h2><p>Schemas publicados en el snapshot OpenAPI.</p></header>
          <Accordion type="multiple" className="models-list">{Object.entries(models).map(([name, schema]) => <AccordionItem key={name} value={name}><AccordionTrigger><code>{name}</code></AccordionTrigger><AccordionContent><JsonSchema value={schema} /></AccordionContent></AccordionItem>)}</Accordion>
        </section>
      </div>
    </div>
  );
}
