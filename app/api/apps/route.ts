import { NextRequest } from "next/server";
import { apiError, apiJson, guardApiRequest, pick } from "@/lib/api-guard";
import { ROBINHOOD_CHAIN_NAME, llamaFetch } from "@/lib/defillama";
import type { AppMetric, AppsPayload } from "@/lib/types";

const MAX_APPS = 25;

type LlamaProtocol = {
  name: string;
  slug: string;
  category?: string;
  logo?: string;
  chainTvls?: Record<string, number>;
  chains?: string[];
};

type FeesProtocol = {
  name: string;
  displayName?: string;
  module?: string;
  category?: string;
  total24h?: number | null;
  total7d?: number | null;
  totalRevenue24h?: number | null;
};

type FeesOverview = {
  total24h?: number | null;
  protocols?: FeesProtocol[];
};

function feeKey(name: string) {
  return name.trim().toLowerCase();
}

export async function GET(req: NextRequest) {
  const blocked = guardApiRequest(req, { limit: 45 });
  if (blocked) return blocked;

  try {
    const [protocols, fees] = await Promise.all([
      llamaFetch<LlamaProtocol[]>("/protocols"),
      llamaFetch<FeesOverview>(
        `/overview/fees/${encodeURIComponent(ROBINHOOD_CHAIN_NAME)}?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true`
      ),
    ]);

    const feeByName = new Map<string, FeesProtocol>();
    for (const p of fees.protocols || []) {
      feeByName.set(feeKey(p.displayName || p.name), p);
      if (p.module) feeByName.set(feeKey(p.module), p);
    }

    const apps: AppMetric[] = [];
    for (const p of protocols) {
      const tvl = p.chainTvls?.[ROBINHOOD_CHAIN_NAME];
      if (tvl == null || !Number.isFinite(tvl) || tvl <= 0) continue;

      const fee =
        feeByName.get(feeKey(p.name)) ||
        feeByName.get(feeKey(p.slug)) ||
        null;

      const chains = p.chains || [];
      apps.push({
        name: p.name,
        slug: p.slug,
        category: p.category || "App",
        logo: p.logo || null,
        tvl,
        fees24h:
          typeof fee?.total24h === "number" && Number.isFinite(fee.total24h)
            ? fee.total24h
            : null,
        fees7d:
          typeof fee?.total7d === "number" && Number.isFinite(fee.total7d)
            ? fee.total7d
            : null,
        revenue24h:
          typeof fee?.totalRevenue24h === "number" &&
          Number.isFinite(fee.totalRevenue24h)
            ? fee.totalRevenue24h
            : null,
        native: chains.length === 1 && chains[0] === ROBINHOOD_CHAIN_NAME,
      });
    }

    apps.sort((a, b) => {
      const af = a.fees24h ?? -1;
      const bf = b.fees24h ?? -1;
      if (bf !== af) return bf - af;
      return b.tvl - a.tvl;
    });

    const feeSum = apps.reduce(
      (s, a) => s + (typeof a.fees24h === "number" ? a.fees24h : 0),
      0
    );

    const trimmed = apps.slice(0, MAX_APPS).map((app) =>
      pick(app, [
        "name",
        "slug",
        "category",
        "logo",
        "tvl",
        "fees24h",
        "fees7d",
        "revenue24h",
        "native",
      ])
    );

    const payload: AppsPayload = {
      chain: ROBINHOOD_CHAIN_NAME,
      totalFees24h:
        typeof fees.total24h === "number" && Number.isFinite(fees.total24h)
          ? fees.total24h
          : feeSum || null,
      apps: trimmed,
      source: "DefiLlama",
      updatedAt: new Date().toISOString(),
    };

    return apiJson(req, payload, {
      cacheControl: "public, s-maxage=300, stale-while-revalidate=600",
    });
  } catch (err) {
    return apiError(req, err, "Failed to load app metrics");
  }
}
