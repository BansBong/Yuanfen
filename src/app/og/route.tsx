import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { BRAND } from "@/data/site";

export const dynamic = "force-static";

/**
 * Open Graph / Twitter card (1200x630). Built from live text + the logo, so the
 * company name is always spelled from BRAND and never baked into artwork.
 */
export async function GET() {
  const logo = await readFile(path.join(process.cwd(), "public/brand/logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf9f3",
          color: "#8b1a1a",
        }}
      >
        <div style={{ width: 1200, height: 14, background: "#d62828", position: "absolute", top: 0 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={560} height={327} alt="" />
        <div style={{ marginTop: 8, fontSize: 56, letterSpacing: 18, paddingLeft: 18 }}>
          {BRAND.name.toUpperCase()}
        </div>
        <div style={{ marginTop: 18, fontSize: 30, color: "#7a0f12" }}>{BRAND.tagline}</div>
        <div style={{ width: 1200, height: 14, background: "#7a0f12", position: "absolute", bottom: 0 }} />
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
