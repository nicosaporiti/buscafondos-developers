import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { openApiDocument } from "@/lib/openapi/document";

export const alt = "BuscaFondos Developers: API de fondos mutuos chilenos con datos públicos de la CMF.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontsDirectory = path.join(process.cwd(), "node_modules", "geist", "dist", "fonts", "geist-sans");

export default async function OpenGraphImage() {
  const [regular, semibold] = await Promise.all([
    readFile(path.join(fontsDirectory, "Geist-Regular.ttf")),
    readFile(path.join(fontsDirectory, "Geist-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    <div style={{ background: "#ffffff", color: "#171717", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: "100%", padding: 72, fontFamily: "Geist" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, fontSize: 30 }}>
        <span style={{ fontWeight: 600 }}>BuscaFondos</span>
        <span style={{ color: "#cccccc" }}>/</span>
        <span style={{ color: "#666666" }}>Developers</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 600, letterSpacing: "-2.5px", lineHeight: 1.08, maxWidth: 980 }}>API de fondos mutuos chilenos.</div>
        <div style={{ display: "flex", color: "#666666", fontSize: 28 }}>api.buscafondos.com · OpenAPI {openApiDocument.openapi} · X-Api-Key</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
