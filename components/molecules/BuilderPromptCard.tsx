"use client";

import * as React from "react";

const SUGGESTIONS = [
  "Build a Robinhood Chain portfolio tracker that shows token balances and USD value for any wallet",
  "Build a live Robinhood gas and block dashboard with Tatum RPC",
  "Build a Robinhood Chain token watchlist with price alerts via Tatum Notifications",
];

const BUILDER_URL = "https://ai.tatum.io/";

export default function BuilderPromptCard() {
  const [prompt, setPrompt] = React.useState(SUGGESTIONS[0]);

  const openBuilder = () => {
    const text = prompt.trim();
    if (!text) return;
    const url = `${BUILDER_URL}?prompt=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className="overflow-hidden rounded-3xl border border-[#d5d3fe] bg-gradient-to-br from-[#1c1e4f] via-[#2a1f7a] to-[#4f37fd] p-5 text-white shadow-lg shadow-[#4f37fd]/20 md:p-6"
      aria-labelledby="builder-heading"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c4b5fd]">
            Tatum Builder
          </p>
          <h2
            id="builder-heading"
            className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl"
          >
            Build an app on Robinhood with a single prompt
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#ddd6fe]">
            Describe what you want. Open Tatum Builder and ship a live Robinhood
            Chain app without writing the boilerplate yourself.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <label
            htmlFor="builder-prompt"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#c4b5fd]"
          >
            Your prompt
          </label>
          <textarea
            id="builder-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-[#c4b5fd] focus:border-white/50"
            placeholder="Build a Robinhood Chain…"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPrompt(s)}
                className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-left text-[11px] font-semibold text-[#ede9fe] hover:bg-white/15"
              >
                {s.length > 52 ? `${s.slice(0, 52)}…` : s}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={openBuilder}
            className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#4f37fd] hover:bg-[#f5f3ff] sm:w-auto"
          >
            Open in Tatum Builder
          </button>
        </div>
      </div>
    </section>
  );
}
