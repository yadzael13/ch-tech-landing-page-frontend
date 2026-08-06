import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Generated (not a designed brand asset) — a placeholder monogram in the
// site's own accent/background colors (app/globals.css) so the browser tab
// isn't blank while a real logo doesn't exist yet.
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2ee6b8",
          color: "#05080a",
          fontSize: 18,
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        CH
      </div>
    ),
    { ...size },
  );
}
