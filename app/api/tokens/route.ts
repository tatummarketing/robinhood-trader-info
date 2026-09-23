import { NextRequest } from "next/server";
import { apiError, apiJson, guardApiRequest, pick } from "@/lib/api-guard";
import {
  enrichLogosFromGeckoTerminal,
  resolveTokenLogo,
} from "@/lib/token-logos";
import type { ChainToken, TokensPayload } from "@/lib/types";

const DEX = "https://api.dexscreener.com/latest/dex/search";
const GECKO_POOLS =
  "https://api.geckoterminal.com/api/v2/networks/robinhood/pools";
const MAX_TOKENS = 15;
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
  priceUsd?: string;
  marketCap?: number;
  fdv?: number;
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
  try {
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
  } catch {
    return [];
  }
}

function upsert(
  best: Map<string, Ranked>,
  input: {
    address: string;
    name: string;
    symbol: string;
    marketCap: number;
    priceUsd: number | null;
    liquidityUsd: number;
    priceChange24h: number | null;
    imageUrl: string | null;
  }
) {
  if (!input.address || /^0x0+$/i.test(input.address)) return;
  if (input.marketCap <= 0) return;

  const key = input.address.toLowerCase();
  const prev = best.get(key);
  const score: [number, number] = [input.marketCap, input.liquidityUsd];
  const imageUrl = input.imageUrl || prev?._imageUrl || null;

  if (prev && score[0] <= prev._score[0] && score[1] <= prev._score[1]) {
    if (imageUrl && !prev._imageUrl) prev._imageUrl = imageUrl;
    return;
  }

  best.set(key, {
    rank: 0,
    name: input.name,
    symbol: input.symbol,
    address: input.address,
    marketCap: input.marketCap,
    priceUsd: input.priceUsd,
    liquidityUsd: input.liquidityUsd,
    priceChange24h: input.priceChange24h,
    imageUrl: null,
    _imageUrl: imageUrl,
    _score: score,
  });
}

async function fromDexScreener(): Promise<Map<string, Ranked>> {
  const lists = await Promise.all(QUERIES.map((q) => search(q)));
  const best = new Map<string, Ranked>();

  for (const pairs of lists) {
    for (const p of pairs) {
      if (p.chainId !== "robinhood") continue;
      const bt = p.baseToken;
      if (!bt?.address) continue;
      upsert(best, {
        address: bt.address,
        name: bt.name || bt.symbol || "Token",
        symbol: bt.symbol || "?",
        marketCap: Number(p.marketCap ?? p.fdv ?? 0) || 0,
        priceUsd: p.priceUsd != null ? Number(p.priceUsd) : null,
        liquidityUsd: Number(p.liquidity?.usd ?? 0) || 0,
        priceChange24h:
          typeof p.priceChange?.h24 === "number"
            ? p.priceChange.h24 / 100
            : null,
        imageUrl: p.info?.imageUrl || null,
      });
    }
  }

  return best;
}

type GeckoPool = {
  attributes?: {
    base_token_price_usd?: string | null;
    market_cap_usd?: string | null;
    fdv_usd?: string | null;
    reserve_in_usd?: string | null;
    price_change_percentage?: { h24?: string | null };
  };
  relationships?: {
    base_token?: { data?: { id?: string } };
  };
};

type GeckoToken = {
  id?: string;
  type?: string;
  attributes?: {
    address?: string;
    name?: string;
    symbol?: string;
    image_url?: string | null;
  };
};

async function fromGeckoTerminal(): Promise<Map<string, Ranked>> {
  const best = new Map<string, Ranked>();

  for (const page of [1, 2]) {
    try {
      const res = await fetch(
        `${GECKO_POOLS}?page=${page}&include=base_token`,
        {
          headers: {
            accept: "application/json",
            "user-agent": "tatum-robinhood-trader-info/0.1",
          },
          cache: "no-store",
        }
      );
      if (!res.ok) continue;
      const json = (await res.json()) as {
        data?: GeckoPool[];
        included?: GeckoToken[];
      };
      const included = new Map(
        (json.included || [])
          .filter((t) => t.type === "token" && t.id)
          .map((t) => [t.id as string, t])
      );

      for (const pool of json.data || []) {
        const relId = pool.relationships?.base_token?.data?.id;
        const token = relId ? included.get(relId) : undefined;
        const attrs = token?.attributes;
        if (!attrs?.address) continue;

        const a = pool.attributes || {};
        const mc =
          Number(a.market_cap_usd ?? 0) || Number(a.fdv_usd ?? 0) || 0;
        const chg = a.price_change_percentage?.h24;
        upsert(best, {
          address: attrs.address,
          name: attrs.name || attrs.symbol || "Token",
          symbol: attrs.symbol || "?",
          marketCap: mc,
          priceUsd:
            a.base_token_price_usd != null
              ? Number(a.base_token_price_usd)
              : null,
          liquidityUsd: Number(a.reserve_in_usd ?? 0) || 0,
          priceChange24h: chg != null && chg !== "" ? Number(chg) / 100 : null,
          imageUrl: attrs.image_url || null,
        });
      }
    } catch {
      // try next page / fall through
    }
  }

  return best;
}

function toPayload(
  best: Map<string, Ranked>,
  source: string
): Promise<TokensPayload> {
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

  return enrichLogosFromGeckoTerminal(tokens).then(() => ({
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
    source,
    updatedAt: new Date().toISOString(),
  }));
}

export async function GET(req: NextRequest) {
  const blocked = guardApiRequest(req, { limit: 40 });
  if (blocked) return blocked;

  try {
    const [dex, gecko] = await Promise.all([
      fromDexScreener(),
      fromGeckoTerminal(),
    ]);
    const useGecko = gecko.size >= dex.size;
    const best = useGecko ? gecko : dex;
    const source = useGecko ? "GeckoTerminal" : "DexScreener";

    const payload = await toPayload(best, source);
    return apiJson(req, payload, {
      cacheControl: "public, s-maxage=120, stale-while-revalidate=300",
    });
  } catch (err) {
    return apiError(req, err, "Failed to load top tokens");
  }
}
