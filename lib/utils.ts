export function clsxm(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatUsd(value?: number | null, digits = 2) {
  if (value == null || Number.isNaN(value)) return "n/a";
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (abs >= 1_000_000_000)
    return `${sign}$${(abs / 1_000_000_000).toFixed(digits)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(digits)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(digits)}K`;
  if (abs >= 1) return `${sign}$${abs.toFixed(digits)}`;
  if (abs === 0) return "$0";
  return `${sign}$${abs.toFixed(4)}`;
}

export function formatPercent(value?: number | null, digits = 2) {
  if (value == null || Number.isNaN(value)) return "n/a";
  const pct = value * 100;
  const sign = pct > 0 ? "+" : pct < 0 ? "−" : "";
  return `${sign}${Math.abs(pct).toFixed(digits)}%`;
}

export function formatGwei(value?: number | null) {
  if (value == null || Number.isNaN(value)) return "n/a";
  if (value >= 1) return `${value.toFixed(3)} gwei`;
  if (value >= 0.001) return `${value.toFixed(4)} gwei`;
  return `${value.toExponential(2)} gwei`;
}

export function shortenAddress(value: string, size = 4) {
  if (!value) return "n/a";
  if (value.length <= size * 2 + 2) return value;
  return `${value.slice(0, size + 2)}…${value.slice(-size)}`;
}
