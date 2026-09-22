"use client";

import Image from "next/image";
import type { AppMetric } from "@/lib/types";
import { clsxm, formatUsd } from "@/lib/utils";

type Props = {
  apps: AppMetric[];
  sort: "fees" | "tvl";
};

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

  return (
    <div className="overflow-x-auto">
      <table
        className={clsxm(
          "w-full border-collapse text-left text-sm",
          showRevenue ? "min-w-[720px]" : "min-w-[640px]"
        )}
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
          {sorted.map((app, i) => (
            <tr
              key={app.slug}
              className="border-b border-[#f0f1f5] transition hover:bg-[#fafbff]"
            >
              <td className="px-3 py-3 tabular-nums text-[#6b7280]">{i + 1}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
