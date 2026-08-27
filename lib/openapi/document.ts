import snapshot from "@/openapi/buscafondos.openapi.json";
import { parseOpenApi } from "./schema";

export const openApiDocument = parseOpenApi(snapshot);
