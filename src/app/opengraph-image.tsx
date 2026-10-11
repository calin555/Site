import { ImageResponse } from "next/og";
import {
  getFeaturedAcStationProduct,
  resolveOgBackgroundImage,
} from "@/lib/seo/og-image";

export const alt = "Stații încărcare EV România — IncarcAuto.ro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const product = await getFeaturedAcStationProduct();
  const productImage = await resolveOgBackgroundImage(product?.image);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background:
            "linear-gradient(135deg, #022c22 0%, #047857 50%, #10b981 100%)",
        }}
      >
        {productImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={productImage}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.45,
            }}
          />
        ) : null}
        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "center",
            padding: 64,
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#6ee7b7",
              marginBottom: 16,
            }}
          >
            INCARCAREAUTO.RO
          </div>
          <div
            style={{
              fontSize: 62,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.05,
              maxWidth: 920,
            }}
          >
            Stații încărcare mașini electrice
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#d1fae5",
              marginTop: 22,
            }}
          >
            AC wallbox · DC rapid · Instalare ANRE
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
