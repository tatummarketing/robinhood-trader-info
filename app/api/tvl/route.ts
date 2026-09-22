import { NextRequest } from "next/server";
import {
  apiError,
  apiJson,
  downsampleSeries,
  guardApiRequest,
} from "@/lib/api-guard";
import {
  ROBINHOOD_CHAIN_NAME,
  changeOver,
  llamaFetch,
} from "@/lib/defillama";
import type { TvlPayload, TvlPoint } from "@/lib/types";

const MAX_SERIES_POINTS = 90;

export async function GET(req: NextRequest) {
  const blocked = guardApiRequest(req, { limit: 60 });
  if (blocked) return blocked;

  try {
    const series = await llamaFetch<TvlPoint[]>(
      `/v2/historicalChainTvl/${encodeURIComponent(ROBINHOOD_CHAIN_NAME)}`
    );

    const clean = (Array.isArray(series) ? series : [])
      .filter((p) => p && typeof p.tvl === "number" && p.tvl > 0)
      .map((p) => ({ date: Number(p.date), tvl: Number(p.tvl) }));

    const currentTvl = clean[clean.length - 1]?.tvl ?? 0;

    const payload: TvlPayload = {
      chain: ROBINHOOD_CHAIN_NAME,
      currentTvl,
      change1d: changeOver(clean, 1),
      change7d: changeOver(clean, 7),
      series: downsampleSeries(clean, MAX_SERIES_POINTS),
      source: "DefiLlama",
      updatedAt: new Date().toISOString(),
    };

    return apiJson(req, payload, {
      cacheControl: "public, s-maxage=300, stale-while-revalidate=600",
    });
  } catch (err) {
    return apiError(req, err, "Failed to load TVL");
  }
}
