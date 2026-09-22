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

  const width = 1000;
  const height = 240;
  // Edge-to-edge on full width — no horizontal padding so the line spans both ends.
  const padX = 0;
  const padY = 12;
  const values = series.map((p) => p.tvl);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, 1);
  const lastIdx = Math.max(series.length - 1, 1);

  const coords = series.map((p, i) => {
    const x = padX + (i / lastIdx) * (width - padX * 2);
    const y =
      height - padY - ((p.tvl - min) / span) * (height - padY * 2);
    return { x, y, ...p };
  });

  // Force exact start/end on the chart edges.
  coords[0].x = 0;
  coords[coords.length - 1].x = width;

  const line = coords
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;

  const first = series[0];
  const last = series[series.length - 1];

  return (
    <div className={className}>
      <div className="w-full overflow-hidden rounded-2xl bg-[#f7f8fc]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          className="block h-56 w-full"
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
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx={width}
            cy={coords[coords.length - 1].y}
            r="5"
            fill="#4f37fd"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
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
