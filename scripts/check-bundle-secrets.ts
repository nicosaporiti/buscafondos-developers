import { readFile, readdir } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const SECRET_PATTERN = /bf_[A-Za-z0-9_-]{20,}/g;
const TEXT_EXTENSIONS = new Set([".js", ".json", ".html", ".txt", ".map"]);

async function filesUnder(directory: string): Promise<readonly string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  }));
  return nested.flat();
}

async function checkBundle(): Promise<void> {
  const directory = resolve(".next");
  const files = (await filesUnder(directory)).filter((path) => TEXT_EXTENSIONS.has(extname(path)));
  const findings: string[] = [];
  await Promise.all(files.map(async (path) => {
    const content = await readFile(path, "utf8");
    if (SECRET_PATTERN.test(content)) findings.push(path);
    SECRET_PATTERN.lastIndex = 0;
  }));
  if (findings.length > 0) throw new Error(`Posibles API keys en bundle:\n${findings.join("\n")}`);
  console.log(`Bundle revisado: ${files.length} archivos, sin patrones de API key.`);
}

checkBundle().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
