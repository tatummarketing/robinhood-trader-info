# Robinhood Trader Overview

Robinhood Chain network pulse, TVL chart, top tokens by market cap, and app fee leaderboard. Powered by Tatum RPC, DexScreener, and DefiLlama.

**Live:** [https://apps.tatum.io/robinhood-trader-info](https://apps.tatum.io/robinhood-trader-info)

Style and structure follow [What's Pumping](https://github.com/tatummarketing/whats-pumping).

## Features

- Dark hero with KPIs: TVL, app fees 24h, top token, gas, latest block
- Top 10 tokens by market cap (DexScreener) with contract links
- Tatum RPC banner (mainnet / testnet copy)
- Historical Robinhood Chain TVL chart
- App table sortable by fees or TVL (native badge for Robinhood-only deploys)
- API proxy safety: host allowlist, rate limits, minimal payloads

## Setup

```bash
cp .env.example .env.local
# TATUM_API_KEY=...

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Webflow Cloud

Deployed to the **Tatum Apps** site at mount `/robinhood-trader-info`.

```bash
webflow auth login
webflow cloud deploy \
  --site-id 618a9dc0e5826661c77e6a67 \
  --app-id 695f2230-b394-42b0-b9e5-e9e848f82eda \
  --environment production \
  --mount /robinhood-trader-info \
  --auto-publish
```

Set `TATUM_API_KEY` (secret) and optionally `NEXT_PUBLIC_BASE_PATH=/robinhood-trader-info` in the Cloud environment variables dashboard, then redeploy.
