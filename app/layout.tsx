import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://apps.tatum.io/robinhood-trader-info"),
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
      "Live Robinhood Chain TVL, fees by app, and Tatum RPC status.",
    url: "https://apps.tatum.io/robinhood-trader-info",
    siteName: "Tatum",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Robinhood Trader Info · Tatum",
    description:
      "Live Robinhood Chain TVL, fees by app, and Tatum RPC status.",
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
