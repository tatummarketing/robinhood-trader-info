# Robinhood Trader Info

Tatum mini-app for Robinhood Chain: live network pulse (Tatum RPC), chain TVL chart, and app fees / revenue leaderboard (DefiLlama).

Style and structure follow [What's Pumping](https://github.com/tatummarketing/whats-pumping) (Tatum design system).

## Features

- Dark hero with KPIs: TVL, app fees 24h, gas, latest block, top fee app
- Tatum RPC banner (mainnet / testnet copy)
- Historical Robinhood Chain TVL chart
- App table sortable by fees or TVL (native badge for Robinhood-only deploys)

## Setup

```bash
cp .env.example .env.local
# set TATUM_API_KEY
npm install
npm run dev
```

Open http://localhost:3000 .

## Webflow Cloud

Deploy under mount `/robinhood-trader-info`.

Set `TATUM_API_KEY` (secret) and optionally `NEXT_PUBLIC_BASE_PATH=/robinhood-trader-info`.

## API proxy safety

All `/api/*` routes:

- **Host allowlist** — only allowlisted `Origin` / `Referer` / same-origin hosts (`API_ALLOWED_HOSTS`)
- **Rate limiting** — per client IP + route (`API_RATE_LIMIT`, `API_RATE_WINDOW_MS`)
- **Minimal payloads** — shaped DTOs only (no raw upstream dumps; TVL series capped; top apps/tokens capped)
- **GET only** — other methods return 405
- **Safe errors** — production responses omit upstream/stack details
