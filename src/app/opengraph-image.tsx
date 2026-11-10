import { brand } from "@/content/site";
import { ImageResponse } from "next/og";

export const alt = `${brand.name}. Less Digging. More Peace of Mind. A smart collar in development.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f3efe8",
          color: "#1a1916",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 8 }}>
          {brand.name.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            lineHeight: 0.95,
            letterSpacing: -2,
            maxWidth: 920,
          }}
        >
          Less Digging. More Peace of Mind.
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#5e5952" }}>
          A smart collar in development. Not for sale.
        </div>
      </div>
    ),
    { ...size },
  );
}
