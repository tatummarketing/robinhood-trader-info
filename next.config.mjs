/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blockchains.tatum.io",
      },
      {
        protocol: "https",
        hostname: "icons.llamao.fi",
      },
      {
        protocol: "https",
        hostname: "cdn.dexscreener.com",
      },
      {
        protocol: "https",
        hostname: "coin-images.coingecko.com",
      },
      {
        protocol: "https",
        hostname: "financialmodelingprep.com",
      },
    ],
  },
};

export default nextConfig;
