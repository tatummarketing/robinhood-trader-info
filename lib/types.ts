export type NetworkSnapshot = {
  chainId: number;
  blockNumber: number;
  gasPriceGwei: number;
  baseFeeGwei: number | null;
  updatedAt: string;
};

export type TvlPoint = {
  date: number;
  tvl: number;
};

export type TvlPayload = {
  chain: string;
  currentTvl: number;
  change1d: number | null;
  change7d: number | null;
  series: TvlPoint[];
  source: string;
  updatedAt: string;
};

export type AppMetric = {
  name: string;
  slug: string;
  category: string;
  logo: string | null;
  tvl: number;
  fees24h: number | null;
  fees7d: number | null;
  revenue24h: number | null;
  native: boolean;
};

export type AppsPayload = {
  chain: string;
  totalFees24h: number | null;
  apps: AppMetric[];
  source: string;
  updatedAt: string;
};

export type ChainToken = {
  rank: number;
  name: string;
  symbol: string;
  address: string;
  marketCap: number;
  priceUsd: number | null;
  liquidityUsd: number;
  priceChange24h: number | null;
  imageUrl: string | null;
};

export type TokensPayload = {
  chain: string;
  tokens: ChainToken[];
  source: string;
  updatedAt: string;
};
