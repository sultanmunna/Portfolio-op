import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Sultan Mahmud, backend engineer";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#0c0e12",
          padding: 72,
          color: "#ece7dc",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#9aa2b1",
          }}
        >
          <span>sultan mahmud</span>
          <span>backend engineer</span>
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 132,
            lineHeight: 1,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Sultan Mahmud
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#9aa2b1" }}>
          <span style={{ width: 14, height: 14, background: "#e8a33d" }} />
          <span>I build the part you never see. FastAPI and applied AI.</span>
        </div>
      </div>
    ),
    size,
  );
}
