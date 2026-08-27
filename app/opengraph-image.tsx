import { ImageResponse } from "next/og";

export const alt = "BuscaFondos Developers — API de fondos mutuos chilenos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ alignItems: "center", background: "#0f1c3d", color: "white", display: "flex", height: "100%", justifyContent: "center", position: "relative", width: "100%" }}>
      <div style={{ backgroundImage: "linear-gradient(#294270 1px, transparent 1px), linear-gradient(90deg, #294270 1px, transparent 1px)", backgroundSize: "52px 52px", inset: 0, opacity: .35, position: "absolute" }} />
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 960, position: "relative" }}>
        <div style={{ color: "#8eb1ff", display: "flex", fontSize: 30, fontWeight: 700 }}>BuscaFondos · Developers</div>
        <div style={{ display: "flex", fontSize: 70, fontWeight: 750, letterSpacing: "-3px", lineHeight: 1.05, marginTop: 28 }}>Datos de fondos mutuos chilenos, listos para construir.</div>
        <div style={{ color: "#bac8e1", display: "flex", fontSize: 27, marginTop: 30 }}>api.buscafondos.com · OpenAPI 3.1</div>
      </div>
    </div>,
    size,
  );
}
