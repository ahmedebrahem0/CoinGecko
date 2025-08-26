export const API_BASE_URL = import.meta.env?.DEV
  ? "/api/coingecko"
  : "https://api.coingecko.com/api/v3";
export const GECKOTERMINAL_API_BASE_URL =
  "https://api.geckoterminal.com/api/v2";

export const API_KEY = import.meta.env?.VITE_CG_API_KEY || "";

export const API_HEADERS = {
  Accept: "application/json",
  ...(API_KEY && { "x-cg-demo-api-key": API_KEY }),
};

export const GECKOTERMINAL_HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Simple in-memory cache and in-flight dedupe
const responseCache = new Map(); // key: url, value: { ts: number, data: any }
const inFlight = new Map(); // key: url, value: Promise<any>
const DEFAULT_TTL_MS = 60_000; // cache /global for 60s to avoid 429

// Simple global queue to space out requests and avoid bursts
let lastRequestTime = 0;
const MIN_GAP_MS = 1200; // ~0.8 req/sec to further avoid 429s

export const fetchFromAPI = async (
  endpoint,
  params = "",
  { ttlMs = DEFAULT_TTL_MS, retries = 3, backoffMs = 1000, signal } = {}
) => {
  const url = `${API_BASE_URL}${endpoint}${params}`;

  // Serve from cache if fresh
  const cached = responseCache.get(url);
  if (cached && Date.now() - cached.ts < ttlMs) {
    return cached.data;
  }

  // Deduplicate concurrent requests
  if (inFlight.has(url)) {
    return inFlight.get(url);
  }

  const req = (async () => {
    try {
      // Respect global pacing
      const now = Date.now();
      const sinceLast = now - lastRequestTime;
      if (sinceLast < MIN_GAP_MS) {
        await new Promise((r) => setTimeout(r, MIN_GAP_MS - sinceLast));
      }

      let attempt = 0;
      while (true) {
        lastRequestTime = Date.now();
        const res = await fetch(url, { headers: API_HEADERS, signal });
        if (res.ok) {
          const data = await res.json();
          responseCache.set(url, { ts: Date.now(), data });
          return data;
        }
        if (res.status === 429 && attempt < retries) {
          const retryAfter = res.headers.get("retry-after");
          const waitMs = retryAfter
            ? Math.max(0, Number(retryAfter) * 1000)
            : Math.round(
                backoffMs * Math.pow(2, attempt) + Math.random() * 250
              );
          await new Promise((r) => setTimeout(r, waitMs));
          attempt += 1;
          continue;
        }
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }
    } finally {
      inFlight.delete(url);
    }
  })();

  inFlight.set(url, req);
  return req;
};

export const fetchFromGeckoTerminal = async (endpoint, params = "", { signal } = {}) => {
  try {
    const url = `${GECKOTERMINAL_API_BASE_URL}${endpoint}${params}`;
    const res = await fetch(url, { headers: GECKOTERMINAL_HEADERS, signal });
    if (!res.ok) {
      throw new Error(
        `GeckoTerminal API Error: ${res.status} ${res.statusText}`
      );
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
};
