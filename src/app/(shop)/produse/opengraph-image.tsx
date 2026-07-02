import { ImageResponse } from "next/og";
import {
  getFeaturedAcStationProduct,
  isUsableRemoteImage,
} from "@/lib/seo/og-image";

export const alt = "Stații încărcare AC — catalog IncarcAuto.ro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const product = await getFeaturedAcStationProduct();
  const productImage = isUsableRemoteImage(product?.image)
    ? product!.image
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background:
            "linear-gradient(135deg, #022c22 0%, #059669 45%, #0d9488 100%)",
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
              opacity: 0.5,
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
            justifyContent: "flex-end",
            padding: 64,
            background:
              "linear-gradient(180deg, transparent 35%, rgba(2,44,34,0.85) 100%)",
          }}
        >
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: "#6ee7b7",
              marginBottom: 10,
              letterSpacing: 1,
            }}
          >
            INCARCAREAUTO.RO
          </div>
          <div
            style={{
              fontSize: 58,
              fontWeight: 800,
              color: "white",
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            Stații încărcare AC
          </div>
          <div
            style={{
              fontSize: 30,
              color: "#d1fae5",
              marginTop: 18,
              maxWidth: 800,
            }}
          >
            {product?.name
              ? `${product.name} · Wallbox 7.4–22 kW`
              : "Wallbox 7.4–22 kW · Livrare România"}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
