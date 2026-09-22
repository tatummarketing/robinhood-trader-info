"use client";

import type { TvlPoint } from "@/lib/types";
import { formatUsd } from "@/lib/utils";

type Props = {
  series: TvlPoint[];
  className?: string;
};

export default function TvlChart({ series, className }: Props) {
  if (!series.length) {
    return (
      <div className="flex h-56 items-center justify-center rounded-2xl bg-[#f7f8fc] text-sm text-[#6b7280]">
        No TVL history yet
      </div>
    );
  }

  const width = 720;
  const height = 240;
  const padX = 12;
  const padY = 16;
  const values = series.map((p) => p.tvl);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);

  const coords = series.map((p, i) => {
    const x =
      padX + (i / Math.max(series.length - 1, 1)) * (width - padX * 2);
    const y =
      height - padY - ((p.tvl - min) / span) * (height - padY * 2);
    return { x, y, ...p };
  });

  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${coords[coords.length - 1].x.toFixed(2)} ${
    height - padY
  } L${coords[0].x.toFixed(2)} ${height - padY} Z`;

  const first = series[0];
  const last = series[series.length - 1];

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-56 w-full overflow-visible"
        role="img"
        aria-label="Robinhood Chain TVL over time"
      >
        <defs>
          <linearGradient id="tvlFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f37fd" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#4f37fd" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#tvlFill)" />
        <path
          d={line}
          fill="none"
          stroke="#4f37fd"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={coords[coords.length - 1].x}
          cy={coords[coords.length - 1].y}
          r="5"
          fill="#4f37fd"
        />
      </svg>
      <div className="mt-2 flex items-center justify-between text-xs text-[#6b7280]">
        <span>
          {new Date(first.date * 1000).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
        <span className="font-semibold text-[#111827]">
          {formatUsd(last.tvl)}
        </span>
        <span>
          {new Date(last.date * 1000).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
