"use client";

import * as React from "react";
import { ROBINHOOD_RPC, ROBINHOOD_RPC_TESTNET } from "@/lib/constants";

const ENDPOINTS = [
  { label: "Mainnet", url: ROBINHOOD_RPC },
  { label: "Testnet", url: ROBINHOOD_RPC_TESTNET },
];

export default function RpcBanner() {
  const [endpoint, setEndpoint] = React.useState(ENDPOINTS[0].url);
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(endpoint);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard may be denied */
    }
  };

  return (
    <section
      className="rounded-3xl border border-[#e6e8ef] bg-white p-5 shadow-sm md:p-6"
      aria-labelledby="rpc-heading"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          <h2
            id="rpc-heading"
            className="text-xl font-bold tracking-tight text-[#111827]"
          >
            Tatum RPC for Robinhood
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#6b7280]">
            Fast, reliable RPC for Robinhood Chain. Built for production
            traffic, low latency, and steady uptime across mainnet and testnet.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href="https://dashboard.tatum.io/chains/robinhood"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl bg-[#4f37fd] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#3f2ae6]"
            >
              Get API Key
            </a>
            <a
              href="https://docs.tatum.io/reference/rpc-robinhood"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-xl border border-[#dfe3ee] bg-white px-3.5 py-2 text-sm font-semibold text-[#111827] hover:bg-[#f7f8fc]"
            >
              Read Docs
            </a>
          </div>
        </div>

        <div className="w-full max-w-xl">
          <label
            htmlFor="rpc-endpoint"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#6b7280]"
          >
            RPC endpoint
          </label>
          <div className="flex gap-2">
            <select
              id="rpc-endpoint"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-[#dfe3ee] bg-[#f7f8fc] px-3 py-2.5 font-mono text-sm text-[#111827] outline-none focus:border-[#4f37fd]"
            >
              {ENDPOINTS.map((ep) => (
                <option key={ep.url} value={ep.url}>
                  {ep.url}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-xl border border-[#dfe3ee] px-3 py-2 text-sm font-semibold text-[#111827] hover:bg-[#f7f8fc]"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-2 flex items-center gap-2 text-xs text-[#6b7280]">
            <span className="inline-block h-2 w-2 rounded-full bg-[#2ccd9a]" />
            Status · powered by Tatum Gateway
          </p>
        </div>
      </div>
    </section>
  );
}
