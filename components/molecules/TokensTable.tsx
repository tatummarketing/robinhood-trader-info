"use client";

import type { ChainToken } from "@/lib/types";
import { clsxm, formatPercent, formatUsd, shortenAddress } from "@/lib/utils";
import { ROBINHOOD_EXPLORER } from "@/lib/constants";

const FREE_LIMIT = 10;
const CTA_URL = "https://dashboard.tatum.io/";

type Props = {
  tokens: ChainToken[];
};

function TokenRow({ token }: { token: ChainToken }) {
  const explorer = `${ROBINHOOD_EXPLORER}/token/${token.address}`;
  const change = token.priceChange24h;
  return (
    <tr className="border-b border-[#f0f1f5] transition hover:bg-[#fafbff]">
      <td className="px-3 py-3 tabular-nums text-[#6b7280]">{token.rank}</td>
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
            <p className="font-semibold text-[#111827]">{token.symbol}</p>
            <p className="max-w-[180px] truncate text-xs text-[#6b7280]">
              {token.name}
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-right tabular-nums font-semibold text-[#111827]">
        {formatUsd(
          token.priceUsd,
          token.priceUsd != null && token.priceUsd < 1 ? 6 : 2
        )}
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
}

const FULL_RANKING = 25;

function placeholderToken(rank: number): ChainToken {
  return {
    rank,
    name: "Locked Token",
    symbol: "••••",
    address: `0x${"0".repeat(40)}`,
    marketCap: 1_000_000 / rank,
    priceUsd: 1,
    liquidityUsd: 100_000 / rank,
    priceChange24h: rank % 2 === 0 ? 0.012 : -0.008,
    imageUrl: null,
  };
}

export default function TokensTable({ tokens }: Props) {
  const visible = tokens.slice(0, FREE_LIMIT);
  const realLocked = tokens.slice(FREE_LIMIT);
  const showGate = visible.length >= FREE_LIMIT;
  const locked =
    realLocked.length > 0
      ? realLocked
      : Array.from({ length: FULL_RANKING - FREE_LIMIT }, (_, i) =>
          placeholderToken(FREE_LIMIT + 1 + i)
        );

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
          {visible.map((token) => (
            <TokenRow key={token.address} token={token} />
          ))}
        </tbody>
      </table>

      {showGate ? (
        <div className="relative mt-0 min-h-[280px] overflow-hidden rounded-b-2xl">
          <div
            className="pointer-events-none select-none blur-[6px] opacity-55"
            aria-hidden
          >
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <tbody>
                {locked.map((token, i) => (
                  <TokenRow
                    key={`${token.address}-${token.rank}-${i}`}
                    token={token}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-white/30 via-white/80 to-white px-4">
            <div className="max-w-md rounded-2xl border border-[#e6e8ef] bg-white/95 px-5 py-5 text-center shadow-lg shadow-[#1c1e4f]/10 backdrop-blur-sm">
              <p className="text-base font-bold tracking-tight text-[#111827]">
                Unlock the full ranking with your API key
              </p>
              <p className="mt-1.5 text-sm leading-5 text-[#6b7280]">
                Top {FREE_LIMIT} are free. Get a Tatum API key to see the rest of
                the top {FULL_RANKING} by market cap.
              </p>
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex rounded-xl bg-[#4f37fd] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#3f2ae6]"
              >
                Get API key
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
