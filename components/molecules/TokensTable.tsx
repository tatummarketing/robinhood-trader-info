"use client";

import type { ChainToken } from "@/lib/types";
import { clsxm, formatPercent, formatUsd, shortenAddress } from "@/lib/utils";
import { ROBINHOOD_EXPLORER } from "@/lib/constants";

type Props = {
  tokens: ChainToken[];
};

export default function TokensTable({ tokens }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-[#e6e8ef] text-xs uppercase tracking-wide text-[#6b7280]">
            <th className="px-3 py-3 font-semibold">#</th>
            <th className="px-3 py-3 font-semibold">Token</th>
            <th className="px-3 py-3 text-right font-semibold">Price</th>
            <th className="px-3 py-3 text-right font-semibold">24h</th>
            <th className="px-3 py-3 text-right font-semibold">Market cap</th>
            <th className="px-3 py-3 text-right font-semibold">Liquidity</th>
            <th className="px-3 py-3 font-semibold">Contract</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => {
            const explorer = `${ROBINHOOD_EXPLORER}/token/${token.address}`;
            const change = token.priceChange24h;
            return (
              <tr
                key={token.address}
                className="border-b border-[#f0f1f5] transition hover:bg-[#fafbff]"
              >
                <td className="px-3 py-3 tabular-nums text-[#6b7280]">
                  {token.rank}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full bg-[#f3f4f8]">
                      {token.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={token.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const fallback = e.currentTarget.nextElementSibling;
                            if (fallback instanceof HTMLElement) {
                              fallback.style.display = "flex";
                            }
                          }}
                        />
                      ) : null}
                      <span
                        className="flex h-full w-full items-center justify-center text-xs font-bold text-[#4f37fd]"
                        style={token.imageUrl ? { display: "none" } : undefined}
                      >
                        {token.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-[#111827]">
                        {token.symbol}
                      </p>
                      <p className="max-w-[180px] truncate text-xs text-[#6b7280]">
                        {token.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-right tabular-nums font-semibold text-[#111827]">
                  {formatUsd(token.priceUsd, token.priceUsd != null && token.priceUsd < 1 ? 6 : 2)}
                </td>
                <td
                  className={clsxm(
                    "px-3 py-3 text-right tabular-nums font-semibold",
                    change == null
                      ? "text-[#6b7280]"
                      : change >= 0
                        ? "text-[#059669]"
                        : "text-[#dc2626]"
                  )}
                >
                  {formatPercent(change)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums font-semibold text-[#111827]">
                  {formatUsd(token.marketCap)}
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-[#6b7280]">
                  {formatUsd(token.liquidityUsd)}
                </td>
                <td className="px-3 py-3">
                  <a
                    href={explorer}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs font-semibold text-[#4f37fd] hover:underline"
                    title={token.address}
                  >
                    {shortenAddress(token.address, 5)}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
