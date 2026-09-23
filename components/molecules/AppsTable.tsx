"use client";

import Image from "next/image";
import type { AppMetric } from "@/lib/types";
import { clsxm, formatUsd } from "@/lib/utils";

const FREE_LIMIT = 7;
const FULL_RANKING = 15;
const CTA_URL = "https://dashboard.tatum.io/";

type Props = {
  apps: AppMetric[];
  sort: "fees" | "tvl";
};

function placeholderApp(rank: number): AppMetric {
  return {
    name: "Locked App",
    slug: `locked-${rank}`,
    category: "••••",
    logo: null,
    tvl: 1_000_000 / rank,
    fees24h: 10_000 / rank,
    fees7d: 50_000 / rank,
    revenue24h: null,
    native: false,
  };
}

function AppRow({
  app,
  rank,
  showRevenue,
}: {
  app: AppMetric;
  rank: number;
  showRevenue: boolean;
}) {
  return (
    <tr className="border-b border-[#f0f1f5] transition hover:bg-[#fafbff]">
      <td className="px-3 py-3 tabular-nums text-[#6b7280]">{rank}</td>
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-full bg-[#f3f4f8]">
            {app.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={app.logo}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src="/chains/robinhood.svg"
                alt=""
                fill
                className="object-contain p-1"
              />
            )}
          </div>
          <div>
            <p className="font-semibold text-[#111827]">{app.name}</p>
            {app.native ? (
              <span className="mt-0.5 inline-flex rounded-full bg-[#ede9fe] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#4f37fd]">
                Native
              </span>
            ) : null}
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-[#6b7280]">{app.category}</td>
      <td className="px-3 py-3 text-right font-semibold tabular-nums text-[#111827]">
        {formatUsd(app.tvl)}
      </td>
      <td
        className={clsxm(
          "px-3 py-3 text-right tabular-nums font-semibold",
          app.fees24h != null && app.fees24h > 0
            ? "text-[#059669]"
            : "text-[#6b7280]"
        )}
      >
        {app.fees24h != null ? formatUsd(app.fees24h) : "n/a"}
      </td>
      <td className="px-3 py-3 text-right tabular-nums text-[#111827]">
        {app.fees7d != null ? formatUsd(app.fees7d) : "n/a"}
      </td>
      {showRevenue ? (
        <td className="px-3 py-3 text-right tabular-nums text-[#111827]">
          {app.revenue24h != null ? formatUsd(app.revenue24h) : "n/a"}
        </td>
      ) : null}
    </tr>
  );
}

export default function AppsTable({ apps, sort }: Props) {
  const sorted = [...apps].sort((a, b) => {
    if (sort === "fees") {
      return (b.fees24h ?? -1) - (a.fees24h ?? -1) || b.tvl - a.tvl;
    }
    return b.tvl - a.tvl;
  });

  const showRevenue = apps.some(
    (a) => typeof a.revenue24h === "number" && a.revenue24h > 0
  );

  const visible = sorted.slice(0, FREE_LIMIT);
  const realLocked = sorted.slice(FREE_LIMIT, FULL_RANKING);
  const showGate = visible.length >= FREE_LIMIT;
  const locked =
    realLocked.length > 0
      ? realLocked
      : Array.from({ length: FULL_RANKING - FREE_LIMIT }, (_, i) =>
          placeholderApp(FREE_LIMIT + 1 + i)
        );

  const minWidth = showRevenue ? "min-w-[720px]" : "min-w-[640px]";

  return (
    <div className="overflow-x-auto">
      <table
        className={clsxm("w-full border-collapse text-left text-sm", minWidth)}
      >
        <thead>
          <tr className="border-b border-[#e6e8ef] text-xs uppercase tracking-wide text-[#6b7280]">
            <th className="px-3 py-3 font-semibold">#</th>
            <th className="px-3 py-3 font-semibold">App</th>
            <th className="px-3 py-3 font-semibold">Category</th>
            <th className="px-3 py-3 text-right font-semibold">TVL</th>
            <th className="px-3 py-3 text-right font-semibold">Fees 24h</th>
            <th className="px-3 py-3 text-right font-semibold">Fees 7d</th>
            {showRevenue ? (
              <th className="px-3 py-3 text-right font-semibold">Revenue 24h</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {visible.map((app, i) => (
            <AppRow
              key={app.slug}
              app={app}
              rank={i + 1}
              showRevenue={showRevenue}
            />
          ))}
        </tbody>
      </table>

      {showGate ? (
        <div className="relative mt-0 min-h-[220px] overflow-hidden rounded-b-2xl">
          <div
            className="pointer-events-none select-none blur-[6px] opacity-55"
            aria-hidden
          >
            <table
              className={clsxm(
                "w-full border-collapse text-left text-sm",
                minWidth
              )}
            >
              <tbody>
                {locked.map((app, i) => (
                  <AppRow
                    key={`${app.slug}-${i}`}
                    app={app}
                    rank={FREE_LIMIT + 1 + i}
                    showRevenue={showRevenue}
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
                the top {FULL_RANKING} by{" "}
                {sort === "fees" ? "fees" : "TVL"}.
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
