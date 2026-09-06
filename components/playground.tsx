"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CodeExample } from "./code-example";
import { KeyIcon } from "./icons";

export type PlaygroundParameter = Readonly<{
  name: string;
  required: boolean;
  /** Contract description, shown as help text under the field. */
  description?: string;
  /** Allowed values from an enum; rendered as a select instead of a free text input. */
  options?: readonly string[];
  /** Default declared by the contract; shown as placeholder and never sent explicitly. */
  defaultValue?: string;
  /** Numeric parameter (integer or number); sets the mobile keyboard hint. */
  numeric?: boolean;
}>;
export type PlaygroundEndpoint = Readonly<{
  id: string;
  path: string;
  summary: string;
  protected: boolean;
  pathParameters: readonly PlaygroundParameter[];
  queryParameters: readonly PlaygroundParameter[];
}>;

type PlaygroundState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; response: PlaygroundResponse }
  | { status: "error"; message: string };

type PlaygroundResponse = Readonly<{
  status: number;
  statusText: string;
  durationMs: number;
  headers: Readonly<Record<string, string>>;
  body: string;
}>;

export function buildPlaygroundRequest(endpoint: PlaygroundEndpoint, pathValues: Readonly<Record<string, string>>, queryValues: Readonly<Record<string, string>>): string {
  const path = endpoint.path.replace(/\{([^}]+)\}/g, (_, name: string) => encodeURIComponent(pathValues[name] ?? ""));
  const query = new URLSearchParams(Object.entries(queryValues).filter(([, value]) => value.trim() !== ""));
  return `https://api.buscafondos.com${path}${query.size > 0 ? `?${query.toString()}` : ""}`;
}

const RELEVANT_HEADERS = ["content-type", "x-ratelimit-limit", "x-ratelimit-remaining", "x-ratelimit-reset", "retry-after"] as const;

function isRequiredParameterMissing(parameter: PlaygroundParameter, values: Readonly<Record<string, string>>): boolean {
  return parameter.required && !values[parameter.name]?.trim();
}

/** Sentinel for the "unset" select item: Radix Select forbids an empty string value. */
const UNSET_OPTION = "__unset__";

type ParameterFieldProps = Readonly<{
  location: "path" | "query";
  parameter: PlaygroundParameter;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}>;

function ParameterField({ location, parameter, value, onChange, disabled }: ParameterFieldProps) {
  const id = `${location}-${parameter.name}`;
  const descriptionId = `${id}-description`;
  const missing = isRequiredParameterMissing(parameter, { [parameter.name]: value });
  const describedBy = [parameter.description || parameter.defaultValue !== undefined ? descriptionId : undefined, missing ? "playground-required-parameters" : undefined].filter(Boolean).join(" ") || undefined;
  const placeholder = parameter.defaultValue !== undefined ? `Por defecto: ${parameter.defaultValue}` : undefined;

  return (
    <div className="field">
      <Label htmlFor={id}>{parameter.name} <span>{location === "path" ? "ruta" : "query"}{parameter.required ? ", requerido" : location === "query" ? ", opcional" : ""}</span></Label>
      {parameter.options ? (
        <Select value={value === "" ? UNSET_OPTION : value} onValueChange={(next) => onChange(next === UNSET_OPTION ? "" : next)} disabled={disabled}>
          <SelectTrigger id={id} aria-label={parameter.name} aria-invalid={missing} aria-describedby={describedBy}><SelectValue placeholder={placeholder ?? "Selecciona un valor"} /></SelectTrigger>
          <SelectContent>
            <SelectItem value={UNSET_OPTION}>{placeholder ?? "Sin valor"}</SelectItem>
            {parameter.options.map((option) => <SelectItem key={option} value={option}><span className="select-endpoint">{option}</span></SelectItem>)}
          </SelectContent>
        </Select>
      ) : (
        <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled} autoComplete="off" required={parameter.required} inputMode={parameter.numeric ? "numeric" : undefined} placeholder={placeholder} aria-invalid={missing} aria-describedby={describedBy} />
      )}
      {parameter.description ? <small id={descriptionId}>{parameter.description}</small> : parameter.defaultValue !== undefined ? <small id={descriptionId}>Valor por defecto: {parameter.defaultValue}.</small> : null}
    </div>
  );
}

export function Playground({ endpoints }: { readonly endpoints: readonly PlaygroundEndpoint[] }) {
  const [endpointId, setEndpointId] = useState(endpoints[0]?.id ?? "");
  const [apiKey, setApiKey] = useState("");
  const [pathValues, setPathValues] = useState<Readonly<Record<string, string>>>({});
  const [queryValues, setQueryValues] = useState<Readonly<Record<string, string>>>({});
  const [state, setState] = useState<PlaygroundState>({ status: "idle" });
  const endpoint = useMemo(() => endpoints.find((item) => item.id === endpointId) ?? endpoints[0], [endpointId, endpoints]);

  if (!endpoint) return <p>El snapshot OpenAPI no contiene endpoints GET.</p>;

  const selectedEndpoint = endpoint;

  const missingRequiredParameters = [
    ...selectedEndpoint.pathParameters.filter((parameter) => isRequiredParameterMissing(parameter, pathValues)).map((parameter) => `ruta: ${parameter.name}`),
    ...selectedEndpoint.queryParameters.filter((parameter) => isRequiredParameterMissing(parameter, queryValues)).map((parameter) => `query: ${parameter.name}`),
  ];
  const hasMissingRequiredParameters = missingRequiredParameters.length > 0;
  const missingRequiredParametersMessage = `Completa los parámetros requeridos: ${missingRequiredParameters.join(", ")}.`;
  const requestUrl = buildPlaygroundRequest(selectedEndpoint, pathValues, queryValues);
  const isRequestInFlight = state.status === "loading";

  function changeEndpoint(value: string): void {
    setEndpointId(value);
    setPathValues({});
    setQueryValues({});
    setState({ status: "idle" });
  }

  function clearCredential(): void {
    setApiKey("");
    setState({ status: "idle" });
  }

  async function sendRequest(): Promise<void> {
    if (selectedEndpoint.protected && apiKey.trim() === "") {
      setState({ status: "error", message: "Ingresa una API key para este endpoint." });
      return;
    }
    if (hasMissingRequiredParameters) {
      setState({ status: "error", message: missingRequiredParametersMessage });
      return;
    }

    setState({ status: "loading" });
    const startedAt = performance.now();
    try {
      const response = await fetch(requestUrl, {
        method: "GET",
        headers: selectedEndpoint.protected ? { "X-Api-Key": apiKey.trim() } : undefined,
        cache: "no-store",
      });
      const text = await response.text();
      let body = text;
      try { body = JSON.stringify(JSON.parse(text) as unknown, null, 2); } catch { /* Plain text is rendered as received. */ }
      const headers = Object.fromEntries(RELEVANT_HEADERS.flatMap((name) => {
        const value = response.headers.get(name);
        return value ? [[name, value]] : [];
      }));
      setState({ status: "success", response: { status: response.status, statusText: response.statusText, durationMs: Math.round(performance.now() - startedAt), headers, body } });
    } catch {
      setState({ status: "error", message: "El request falló antes de recibir respuesta (red, CORS o bloqueo del navegador). Revisa la consola del navegador." });
    }
  }

  return (
    <div className="playground">
      <section className="playground-request" aria-labelledby="playground-request-title">
        <header><h2 id="playground-request-title" className="heading-20">Request</h2><p>GET directo desde este tab a api.buscafondos.com, sin proxy.</p></header>
        <div className="field"><Label htmlFor="endpoint">Endpoint</Label><Select value={selectedEndpoint.id} onValueChange={changeEndpoint} disabled={isRequestInFlight}><SelectTrigger id="endpoint" aria-label="Endpoint GET"><SelectValue /></SelectTrigger><SelectContent>{endpoints.map((item) => <SelectItem key={item.id} value={item.id}><span className="select-endpoint">GET {item.path}</span></SelectItem>)}</SelectContent></Select><small>{selectedEndpoint.summary}</small></div>
        {selectedEndpoint.pathParameters.map((parameter) => <ParameterField key={`path-${parameter.name}`} location="path" parameter={parameter} value={pathValues[parameter.name] ?? ""} onChange={(value) => setPathValues((current) => ({ ...current, [parameter.name]: value }))} disabled={isRequestInFlight} />)}
        {selectedEndpoint.queryParameters.map((parameter) => <ParameterField key={`query-${parameter.name}`} location="query" parameter={parameter} value={queryValues[parameter.name] ?? ""} onChange={(value) => setQueryValues((current) => ({ ...current, [parameter.name]: value }))} disabled={isRequestInFlight} />)}
        {selectedEndpoint.protected ? <div className="field key-field"><Label htmlFor="playground-api-key">API key <span>secreto, solo en memoria</span></Label><Input id="playground-api-key" type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} disabled={isRequestInFlight} placeholder="bf_…" autoComplete="off" autoCapitalize="none" spellCheck={false} /><small>Se envía solo en el header X-Api-Key, directamente a la API.</small></div> : null}
        <div className="request-preview"><span>GET</span><code>{requestUrl}</code></div>
        {hasMissingRequiredParameters ? <p id="playground-required-parameters" className="response-error" role="alert">{missingRequiredParametersMessage}</p> : null}
        <div className="playground-actions"><Button size="lg" onClick={() => void sendRequest()} disabled={isRequestInFlight || hasMissingRequiredParameters}>{isRequestInFlight ? "Enviando…" : "Enviar request"}</Button><Button size="lg" variant="outline" onClick={clearCredential} disabled={isRequestInFlight || apiKey === ""}><KeyIcon /> Limpiar credencial</Button></div>
      </section>
      <section className="playground-output" aria-labelledby="playground-response-title" aria-live="polite">
        <header><h2 id="playground-response-title" className="heading-20">Response</h2><p>Código de estado, duración, headers de cuota y cuerpo.</p></header>
        {state.status === "idle" ? <div className="empty-response"><p>Configura el request y presiona “Enviar request”.</p></div> : null}
        {state.status === "loading" ? <div className="loading-response"><span /> Esperando respuesta…</div> : null}
        {state.status === "error" ? <div className="response-error" role="alert">{state.message}</div> : null}
        {state.status === "success" ? <div className="response-data"><div className="response-meta"><strong data-ok={state.response.status < 400}>{state.response.status} {state.response.statusText}</strong><span>{state.response.durationMs} ms</span></div>{Object.keys(state.response.headers).length > 0 ? <dl>{Object.entries(state.response.headers).map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl> : null}<CodeExample title="Body" language="json" code={state.response.body} /></div> : null}
      </section>
    </div>
  );
}
