const LLAMA = "https://api.llama.fi";
export const ROBINHOOD_CHAIN_NAME = "Robinhood Chain";

export async function llamaFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${LLAMA}${path}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`DefiLlama ${path} failed (${res.status})`);
  }
  return (await res.json()) as T;
}

export function changeOver(
  series: Array<{ date: number; tvl: number }>,
  days: number
): number | null {
  if (!series.length) return null;
  const latest = series[series.length - 1];
  if (!latest?.tvl) return null;
  const target = latest.date - days * 86_400;
  let prior = series[0];
  for (const point of series) {
    if (point.date <= target) prior = point;
    else break;
  }
  if (!prior?.tvl) return null;
  return (latest.tvl - prior.tvl) / prior.tvl;
}
