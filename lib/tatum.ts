import { ROBINHOOD_RPC } from "@/lib/constants";

const API = "https://api.tatum.io";
export { ROBINHOOD_RPC, ROBINHOOD_RPC_TESTNET } from "@/lib/constants";

function apiKey() {
  const key = process.env.TATUM_API_KEY;
  if (!key) throw new Error("TATUM_API_KEY is not set");
  return key;
}

export type TatumResult =
  | { ok: true; status: number; body: unknown }
  | { ok: false; status: number; body: unknown };

export async function tatumFetch(path: string): Promise<TatumResult> {
  const res = await fetch(`${API}${path}`, {
    headers: {
      "x-api-key": apiKey(),
      accept: "application/json",
    },
    cache: "no-store",
  });

  const text = await res.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!res.ok) {
    return { ok: false, status: res.status, body };
  }

  return { ok: true, status: res.status, body };
}

export async function tatumRpc(
  method: string,
  params: unknown[] = [],
  rpcUrl = ROBINHOOD_RPC
): Promise<unknown> {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey(),
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method,
      params,
    }),
    cache: "no-store",
  });

  const json = (await res.json()) as {
    result?: unknown;
    error?: { message?: string };
  };

  if (!res.ok || json.error) {
    throw new Error(json.error?.message || `RPC failed (${res.status})`);
  }

  return json.result;
}
