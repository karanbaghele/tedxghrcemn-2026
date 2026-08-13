import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "./premium.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "tedxghrcemn.example";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  return {
    metadataBase: new URL(origin),
    title: { default: "TEDxGHRCEMN 2026", template: "%s — TEDxGHRCEMN 2026" },
    description: "Beyond the Dots — TEDxGHRCEMN 2026 at G.H. Raisoni College of Engineering & Management, Nagpur.",
    openGraph: { type: "website", siteName: "TEDxGHRCEMN", locale: "en_IN", images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "TEDxGHRCEMN 2026 — Beyond the Dots" }] },
    twitter: { card: "summary_large_image", images: [`${origin}/og.png`] },
  };
}

export const viewport: Viewport = { themeColor: "#050505", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
