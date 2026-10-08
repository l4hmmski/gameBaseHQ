
import { ImageResponse } from "next/og";

export const alt =
  "GameBaseHQ - Your Gaming World. One Place.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 30,
            padding: 60,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 92,
              fontWeight: 900,
              letterSpacing: -4,
            }}
          >
            <span>GameBase</span>
            <span style={{ color: "#818cf8" }}>
              HQ
            </span>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 38,
              fontWeight: 700,
            }}
          >
            Your Gaming World. One Place.
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 25,
              color: "#cbd5e1",
            }}
          >
            Build your library. Track your games.
          </div>

          <div
            style={{
              display: "flex",
              marginTop: 20,
              borderRadius: 14,
              background: "#4f46e5",
              padding: "14px 30px",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            gamebasehq.app
          </div>
        </div>
      </div>
    ),
    size,
  );
}
