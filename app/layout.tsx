import type { Metadata } from "next";
import "./globals.css";

const SITE = "https://apps.tatum.io/robinhood-trader-info";
const OG_IMAGE =
  "https://cdn.prod.website-files.com/618a9dc0e5826661c77e6a67/6ab226c69ae1aab10968b8c3_robinhood-trader-info-og.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: "Robinhood Trader Overview · Tatum",
  description:
    "A stapshot of trading activity on Robinhood. Live TVL, top tokens, app fees, and Tatum RPC.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
