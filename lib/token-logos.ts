/** Stable CDN logos for well-known tokens when DexScreener has no imageUrl. */
const CRYPTO_LOGOS: Array<{
  symbol: string;
  nameIncludes?: string[];
  url: string;
}> = [
  {
    symbol: "USDG",
    nameIncludes: ["global dollar"],
    url: "https://coin-images.coingecko.com/coins/images/51281/large/GDN_USDG_Token_200x200.png",
  },
  {
    symbol: "MORPHO",
    nameIncludes: ["morpho"],
    url: "https://coin-images.coingecko.com/coins/images/29837/large/Morpho-token-icon.png",
  },
  {
    symbol: "LIT",
    nameIncludes: ["lighter"],
    url: "https://coin-images.coingecko.com/coins/images/71121/large/lighter.png",
  },
  {
    symbol: "HOOD",
    nameIncludes: ["greenhood"],
    url: "https://coin-images.coingecko.com/coins/images/102176621/large/logo-hood.png",
  },
  {
    symbol: "WETH",
    url: "https://coin-images.coingecko.com/coins/images/2518/large/weth.png",
  },
  {
    symbol: "USDC",
    url: "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png",
  },
  {
    symbol: "USDT",
    url: "https://coin-images.coingecko.com/coins/images/325/large/Tether.png",
  },
  {
    symbol: "WBTC",
    url: "https://coin-images.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png",
  },
];

const EQUITY_NAME =
  /common stock|class [a-z]\b|inc\.|corp\.|ltd\.|etf trust|tokenized stock/i;

function cryptoLogo(symbol: string, name: string): string | null {
  const sym = symbol.toUpperCase();
  const lower = name.toLowerCase();
  for (const entry of CRYPTO_LOGOS) {
    if (entry.symbol !== sym) continue;
    if (
      entry.nameIncludes &&
      !entry.nameIncludes.some((frag) => lower.includes(frag))
    ) {
      continue;
    }
    return entry.url;
  }
  return null;
}

function equityLogo(symbol: string, name: string): string | null {
  if (!EQUITY_NAME.test(name)) return null;
  const sym = symbol.toUpperCase().replace(/[^A-Z0-9.-]/g, "");
  if (!sym || sym.length > 8) return null;
  return `https://financialmodelingprep.com/image-stock/${sym}.png`;
}

/** Resolve a display logo URL for a Robinhood Chain token. */
export function resolveTokenLogo(input: {
  symbol: string;
  name: string;
  imageUrl?: string | null;
}): string | null {
  if (input.imageUrl) return input.imageUrl;
  return (
    cryptoLogo(input.symbol, input.name) ||
    equityLogo(input.symbol, input.name) ||
    null
  );
}

type GeckoToken = {
  attributes?: { address?: string; image_url?: string | null };
};

/** Fill missing logos from GeckoTerminal (batch). */
export async function enrichLogosFromGeckoTerminal(
  tokens: Array<{ address: string; imageUrl: string | null }>
): Promise<void> {
  const missing = tokens.filter((t) => !t.imageUrl);
  if (missing.length === 0) return;

  const addrs = missing.map((t) => t.address).join(",");
  const url = `https://api.geckoterminal.com/api/v2/networks/robinhood/tokens/multi/${addrs}`;

  try {
    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent": "tatum-robinhood-trader-info/0.1",
      },
      cache: "no-store",
    });
    if (!res.ok) return;
    const json = (await res.json()) as { data?: GeckoToken[] };
    const byAddr = new Map<string, string>();
    for (const row of json.data || []) {
      const addr = row.attributes?.address?.toLowerCase();
      const img = row.attributes?.image_url;
      if (addr && img) byAddr.set(addr, img);
    }
    for (const t of missing) {
      const img = byAddr.get(t.address.toLowerCase());
      if (img) t.imageUrl = img;
    }
  } catch {
    // Logos are best-effort; leave null for letter avatars.
  }
}
