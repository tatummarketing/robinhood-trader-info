"use client";

import Image from "next/image";
import * as React from "react";
import AppsTable from "@/components/molecules/AppsTable";
import BuilderPromptCard from "@/components/molecules/BuilderPromptCard";
import RpcBanner from "@/components/molecules/RpcBanner";
import TokensTable from "@/components/molecules/TokensTable";
import TvlChart from "@/components/molecules/TvlChart";
import { apiUrl } from "@/lib/base-path";
import {
  ROBINHOOD_DOCS,
  ROBINHOOD_EXPLORER,
  ROBINHOOD_RPC,
} from "@/lib/constants";
import type {
  AppsPayload,
  NetworkSnapshot,
  TokensPayload,
  TvlPayload,
} from "@/lib/types";
import { clsxm, formatGwei, formatPercent, formatUsd } from "@/lib/utils";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new Error(
      res.ok ? "Invalid JSON from API" : `Request failed (${res.status})`
    );
  }
  if (!res.ok) {
    const message =
      typeof data === "object" &&
      data &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
        ? (data as { message: string }).message
        : `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

export default function RobinhoodBoard() {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [network, setNetwork] = React.useState<NetworkSnapshot | null>(null);
  const [tvl, setTvl] = React.useState<TvlPayload | null>(null);
  const [apps, setApps] = React.useState<AppsPayload | null>(null);
  const [tokens, setTokens] = React.useState<TokensPayload | null>(null);
  const [sort, setSort] = React.useState<"fees" | "tvl">("fees");

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [net, tvlData, appsData, tokensData] = await Promise.all([
        fetchJson<NetworkSnapshot>(apiUrl("/api/network")),
        fetchJson<TvlPayload>(apiUrl("/api/tvl")),
        fetchJson<AppsPayload>(apiUrl("/api/apps")),
        fetchJson<TokensPayload>(apiUrl("/api/tokens")),
      ]);
      setNetwork(net);
      setTvl(tvlData);
      setApps(appsData);
      setTokens(tokensData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load();
    const id = window.setInterval(load, 60_000);
    return () => window.clearInterval(id);
  }, [load]);

  const topFee = apps?.apps.find((a) => a.fees24h != null && a.fees24h > 0);
  const topToken = tokens?.tokens?.[0] ?? null;
  const topTvl = apps?.apps?.length
    ? [...apps.apps].sort((a, b) => b.tvl - a.tvl)[0]
    : null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <header className="overflow-hidden rounded-3xl bg-[#1c1e4f] text-white shadow-lg shadow-[#1c1e4f]/20">
        <div className="relative px-5 py-8 md:px-8 md:py-10">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(ellipse at 85% 20%, rgba(79,55,253,0.55), transparent 50%), radial-gradient(ellipse at 10% 90%, rgba(44,205,154,0.25), transparent 45%)",
            }}
          />
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a5a8c7]">
                  Robinhood Chain
                </p>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                  Robinhood Trader Info
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-[#c7cadf] md:text-base">
                  Network pulse, chain TVL, top tokens by market cap, and which
                  apps are generating fees. Powered by Tatum RPC, DexScreener,
                  and DefiLlama.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#4f37fd] px-3 py-1 text-xs font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2ccd9a]" />
                  Live
                </span>
                <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-[#d5d7e8]">
                  Chain {network?.chainId ?? "4663"}
                </span>
                <Image
                  src="/chains/robinhood.svg"
                  alt=""
                  width={36}
                  height={36}
                  className="rounded-full bg-white/10 p-1"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[
                {
                  label: "Chain TVL",
                  value: formatUsd(tvl?.currentTvl),
                  hint:
                    tvl?.change1d != null ? formatPercent(tvl.change1d) : "n/a",
                  hintClass:
                    (tvl?.change1d ?? 0) >= 0
                      ? "text-[#2ccd9a]"
                      : "text-[#f97066]",
                },
                {
                  label: "App fees 24h",
                  value: formatUsd(apps?.totalFees24h),
                  hint: "DefiLlama",
                  hintClass: "text-[#a5a8c7]",
                },
                {
                  label: "Top token",
                  value: topToken?.symbol ?? "n/a",
                  hint: topToken
                    ? formatUsd(topToken.marketCap)
                    : "DexScreener",
                  hintClass: "text-[#2ccd9a]",
                },
                {
                  label: "Gas price",
                  value: formatGwei(network?.gasPriceGwei),
                  hint:
                    network?.baseFeeGwei != null
                      ? `Base ${formatGwei(network.baseFeeGwei)}`
                      : "Tatum RPC",
                  hintClass: "text-[#a5a8c7]",
                },
                {
                  label: "Latest block",
                  value: network?.blockNumber
                    ? `#${network.blockNumber.toLocaleString()}`
                    : "n/a",
                  hint: topFee?.name
                    ? `Top fees: ${topFee.name}`
                    : "Mainnet",
                  hintClass: "text-[#a5a8c7]",
                },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#a5a8c7]">
                    {card.label}
                  </p>
                  <p className="mt-1 truncate text-lg font-bold tabular-nums">
                    {card.value}
                  </p>
                  <p
                    className={clsxm("mt-1 text-xs font-medium", card.hintClass)}
                  >
                    {card.hint}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-xs text-[#c7cadf]">
              <span className="font-semibold text-white">Robinhood L2</span>
              <a
                href={ROBINHOOD_EXPLORER}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Explorer
              </a>
              <a
                href={ROBINHOOD_DOCS}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Docs
              </a>
              <a
                href={ROBINHOOD_RPC}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                RPC
              </a>
              <button
                type="button"
                onClick={load}
                className="ml-auto rounded-lg border border-white/15 px-2.5 py-1 font-semibold hover:bg-white/10"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      </header>

      {error ? (
        <div className="rounded-2xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm text-[#b42318]">
          {error}
        </div>
      ) : null}

      {loading && !tvl ? (
        <div className="rounded-3xl border border-[#e6e8ef] bg-white px-5 py-10 text-center text-sm text-[#6b7280] shadow-sm">
          Loading Robinhood markets…
        </div>
      ) : null}

      <RpcBanner />

      <section className="rounded-3xl border border-[#e6e8ef] bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#111827]">
              Top 10 tokens by market cap
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Live Robinhood Chain tokens ranked by market cap, with contract
              address and 24h change.
            </p>
          </div>
          {topToken ? (
            <p className="text-sm font-semibold text-[#111827]">
              #1 {topToken.symbol} · {formatUsd(topToken.marketCap)}
            </p>
          ) : null}
        </div>
        {tokens?.tokens?.length ? (
          <TokensTable tokens={tokens.tokens} />
        ) : (
          <p className="py-8 text-center text-sm text-[#6b7280]">
            No token rankings yet
          </p>
        )}
        <p className="mt-4 text-xs text-[#6b7280]">
          Source: {tokens?.source ?? "DexScreener"} · updated{" "}
          {tokens?.updatedAt
            ? new Date(tokens.updatedAt).toLocaleString()
            : "n/a"}
        </p>
      </section>

      <section className="rounded-3xl border border-[#e6e8ef] bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#111827]">
              Robinhood Chain TVL
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Historical total value locked
              {tvl?.change7d != null ? (
                <>
                  {" "}
                  · 7d{" "}
                  <span
                    className={
                      tvl.change7d >= 0 ? "text-[#059669]" : "text-[#dc2626]"
                    }
                  >
                    {formatPercent(tvl.change7d)}
                  </span>
                </>
              ) : null}
            </p>
          </div>
          <p className="text-2xl font-extrabold tabular-nums text-[#111827]">
            {formatUsd(tvl?.currentTvl)}
          </p>
        </div>
        <TvlChart series={tvl?.series ?? []} />
        <p className="mt-3 text-xs text-[#6b7280]">
          Source: {tvl?.source ?? "DefiLlama"} · updated{" "}
          {tvl?.updatedAt
            ? new Date(tvl.updatedAt).toLocaleString()
            : "n/a"}
        </p>
      </section>

      <section className="rounded-3xl border border-[#e6e8ef] bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#111827]">
              App fees & TVL
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Which apps are generating fees on Robinhood Chain. Native means
              deploy only on this chain.
              {topTvl ? (
                <>
                  {" "}
                  Largest TVL: <strong>{topTvl.name}</strong> (
                  {formatUsd(topTvl.tvl)}).
                </>
              ) : null}
            </p>
          </div>
          <div className="flex rounded-xl border border-[#dfe3ee] p-1">
            {(
              [
                ["fees", "Fees 24h"],
                ["tvl", "TVL"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSort(id)}
                className={clsxm(
                  "rounded-lg px-3 py-1.5 text-sm font-semibold transition",
                  sort === id
                    ? "bg-[#4f37fd] text-white"
                    : "text-[#6b7280] hover:text-[#111827]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {apps?.apps?.length ? (
          <AppsTable apps={apps.apps} sort={sort} />
        ) : (
          <p className="py-8 text-center text-sm text-[#6b7280]">
            No app metrics yet
          </p>
        )}
        <p className="mt-4 text-xs text-[#6b7280]">
          Fees and revenue from DefiLlama when reported. Apps without fee data
          show as n/a. TVL is scoped to Robinhood Chain via DefiLlama{" "}
          <code className="rounded bg-[#f3f4f8] px-1">chainTvls</code>.
        </p>
      </section>

      <BuilderPromptCard />
    </div>
  );
}
