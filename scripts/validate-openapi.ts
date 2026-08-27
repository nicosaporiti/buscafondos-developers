import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseOpenApi } from "../lib/openapi/schema";

async function validateOpenApi(): Promise<void> {
  const path = resolve("openapi/buscafondos.openapi.json");
  const raw: unknown = JSON.parse(await readFile(path, "utf8"));
  const schema = parseOpenApi(raw);
  const operations = Object.values(schema.paths).reduce(
    (total, item) => total + Object.keys(item).filter((key) => ["get", "post", "put", "patch", "delete"].includes(key)).length,
    0,
  );
  if (operations === 0) throw new Error("El snapshot no contiene operaciones");
  console.log(`OpenAPI válido: ${Object.keys(schema.paths).length} rutas, ${operations} operaciones.`);
}

validateOpenApi().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
