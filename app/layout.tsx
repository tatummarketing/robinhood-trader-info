import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const SITE = "https://apps.tatum.io/robinhood-trader-info";
const OG_IMAGE =
  "https://cdn.prod.website-files.com/618a9dc0e5826661c77e6a67/6ab226c69ae1aab10968b8c3_robinhood-trader-info-og.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Robinhood Trader Overview · Tatum",
  description:
    "A stapshot of trading activity on Robinhood. Live TVL, top tokens, app fees, and Tatum RPC.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "32x32" }],
    apple: [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "256x256" },
    ],
    shortcut: "/favicon.png",
  },
  openGraph: {
    title: "Robinhood Trader Overview · Tatum",
    description: "A stapshot of trading activity on Robinhood.",
    url: SITE,
    siteName: "Tatum",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Robinhood Trader Overview by Tatum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Robinhood Trader Overview · Tatum",
    description: "A stapshot of trading activity on Robinhood.",
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
