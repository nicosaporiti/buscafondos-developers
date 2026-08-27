import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseOpenApi } from "../lib/openapi/schema";

const SOURCE_URL = "https://api.buscafondos.com/openapi.json";
const SNAPSHOT_PATH = resolve("openapi/buscafondos.openapi.json");

async function updateOpenApi(): Promise<void> {
  const response = await fetch(SOURCE_URL, {
    headers: { "User-Agent": "BuscaFondosDevelopers/0.1 (+https://developers.buscafondos.com)" },
  });
  if (!response.ok) {
    throw new Error(`No se pudo descargar OpenAPI: HTTP ${response.status}`);
  }

  const raw: unknown = await response.json();
  const schema = parseOpenApi(raw);
  await mkdir(resolve("openapi"), { recursive: true });
  await writeFile(SNAPSHOT_PATH, `${JSON.stringify(schema, null, 2)}\n`, "utf8");
  console.log(`OpenAPI ${schema.openapi} actualizado desde ${SOURCE_URL}`);
  console.log(`Snapshot: ${SNAPSHOT_PATH} (${Object.keys(schema.paths).length} rutas)`);
}

updateOpenApi().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
