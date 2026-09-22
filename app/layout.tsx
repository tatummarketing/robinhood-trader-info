import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const SITE = "https://apps.tatum.io/robinhood-trader-info";
const OG_IMAGE = `${SITE}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Robinhood Trader Info · Tatum",
  description:
    "Robinhood Chain network pulse, TVL chart, top tokens by market cap, and app fee leaderboard. Powered by Tatum RPC.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "32x32" }],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "256x256" },
    ],
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: "Robinhood Trader Info · Tatum",
    description:
      "Live Robinhood Chain TVL, fees by app, top tokens, and Tatum RPC status.",
    url: SITE,
    siteName: "Tatum",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Robinhood Trader Info — Robinhood Chain dashboard by Tatum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Robinhood Trader Info · Tatum",
    description:
      "Live Robinhood Chain TVL, fees by app, top tokens, and Tatum RPC status.",
    images: [OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
