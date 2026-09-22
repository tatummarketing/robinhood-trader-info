import { NextRequest } from "next/server";
import { apiError, apiJson, guardApiRequest, pick } from "@/lib/api-guard";
import { tatumRpc } from "@/lib/tatum";
import type { NetworkSnapshot } from "@/lib/types";

function hexToNumber(hex: unknown): number {
  if (typeof hex !== "string") return NaN;
  return Number(BigInt(hex));
}

export async function GET(req: NextRequest) {
  const blocked = guardApiRequest(req, { limit: 90 });
  if (blocked) return blocked;

  try {
    const [chainIdHex, gasHex, block] = await Promise.all([
      tatumRpc("eth_chainId"),
      tatumRpc("eth_gasPrice"),
      tatumRpc("eth_getBlockByNumber", ["latest", false]),
    ]);

    const blockObj =
      block && typeof block === "object"
        ? (block as { number?: string; baseFeePerGas?: string })
        : {};

    const gasWei = hexToNumber(gasHex);
    const baseWei =
      typeof blockObj.baseFeePerGas === "string"
        ? hexToNumber(blockObj.baseFeePerGas)
        : NaN;

    const payload: NetworkSnapshot = {
      chainId: hexToNumber(chainIdHex),
      blockNumber: hexToNumber(blockObj.number),
      gasPriceGwei: Number.isFinite(gasWei) ? gasWei / 1e9 : NaN,
      baseFeeGwei: Number.isFinite(baseWei) ? baseWei / 1e9 : null,
      updatedAt: new Date().toISOString(),
    };

    return apiJson(req, pick(payload, [
      "chainId",
      "blockNumber",
      "gasPriceGwei",
      "baseFeeGwei",
      "updatedAt",
    ]), {
      cacheControl: "public, s-maxage=15, stale-while-revalidate=30",
    });
  } catch (err) {
    return apiError(req, err, "Failed to load network snapshot");
  }
}
