import { NextRequest } from "next/server";
import { apiError, apiJson, guardApiRequest, pick } from "@/lib/api-guard";
import {
  enrichLogosFromGeckoTerminal,
  resolveTokenLogo,
} from "@/lib/token-logos";
import type { ChainToken, TokensPayload } from "@/lib/types";

const DEX = "https://api.dexscreener.com/latest/dex/search";
const MAX_TOKENS = 10;
const QUERIES = [
  "ETH",
  "USDC",
  "USDG",
  "WETH",
  "UNI",
  "HOOD",
  "stock",
  "GOLD",
  "USDT",
  "WBTC",
  "morpho",
  "lighter",
  "robinhood",
  "fables",
  "LIT",
];

type DexPair = {
  chainId?: string;
  dexId?: string;
  url?: string;
  priceUsd?: string;
  marketCap?: number;
  fdv?: number;
  volume?: { h24?: number };
  priceChange?: { h24?: number };
  liquidity?: { usd?: number };
  baseToken?: { address?: string; name?: string; symbol?: string };
  info?: { imageUrl?: string };
};

type Ranked = ChainToken & {
  _score: [number, number];
  _imageUrl: string | null;
};

async function search(q: string): Promise<DexPair[]> {
  const res = await fetch(`${DEX}?q=${encodeURIComponent(q)}`, {
    headers: {
      accept: "application/json",
      "user-agent": "tatum-robinhood-trader-info/0.1",
    },
    cache: "no-store",
  });
  if (!res.ok) return [];
  const json = (await res.json()) as { pairs?: DexPair[] };
  return Array.isArray(json.pairs) ? json.pairs : [];
}

export async function GET(req: NextRequest) {
  const blocked = guardApiRequest(req, { limit: 40 });
  if (blocked) return blocked;

  try {
    const lists = await Promise.all(QUERIES.map((q) => search(q)));
    const best = new Map<string, Ranked>();

    for (const pairs of lists) {
      for (const p of pairs) {
        if (p.chainId !== "robinhood") continue;
        const bt = p.baseToken;
        const address = bt?.address;
        if (!address || /^0x0+$/i.test(address)) continue;

        const key = address.toLowerCase();
        const marketCap = Number(p.marketCap ?? p.fdv ?? 0) || 0;
        const liquidityUsd = Number(p.liquidity?.usd ?? 0) || 0;
        if (marketCap <= 0) continue;

        const prev = best.get(key);
        const score: [number, number] = [marketCap, liquidityUsd];
        const imageUrl = p.info?.imageUrl || prev?._imageUrl || null;

        if (prev && score[0] <= prev._score[0] && score[1] <= prev._score[1]) {
          if (imageUrl && !prev._imageUrl) prev._imageUrl = imageUrl;
          continue;
        }

        best.set(key, {
          rank: 0,
          name: bt?.name || bt?.symbol || "Token",
          symbol: bt?.symbol || "?",
          address,
          marketCap,
          priceUsd: p.priceUsd != null ? Number(p.priceUsd) : null,
          liquidityUsd,
          priceChange24h:
            typeof p.priceChange?.h24 === "number"
              ? p.priceChange.h24 / 100
              : null,
          imageUrl: null,
          _imageUrl: imageUrl,
          _score: score,
        });
      }
    }

    const tokens: ChainToken[] = [...best.values()]
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, MAX_TOKENS)
      .map((t, i) => {
        const shaped = pick(t, [
          "name",
          "symbol",
          "address",
          "marketCap",
          "priceUsd",
          "liquidityUsd",
          "priceChange24h",
        ]);
        return {
          ...shaped,
          rank: i + 1,
          imageUrl: resolveTokenLogo({
            ...shaped,
            imageUrl: t._imageUrl,
          }),
        };
      });

    await enrichLogosFromGeckoTerminal(tokens);

    const payload: TokensPayload = {
      chain: "Robinhood Chain",
      tokens: tokens.map((t) =>
        pick(t, [
          "rank",
          "name",
          "symbol",
          "address",
          "marketCap",
          "priceUsd",
          "liquidityUsd",
          "priceChange24h",
          "imageUrl",
        ])
      ),
      source: "DexScreener",
      updatedAt: new Date().toISOString(),
    };

    return apiJson(req, payload, {
      cacheControl: "public, s-maxage=120, stale-while-revalidate=300",
    });
  } catch (err) {
    return apiError(req, err, "Failed to load top tokens");
  }
}
