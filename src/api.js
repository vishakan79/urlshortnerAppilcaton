export const API_URL = (
  import.meta.env.VITE_API_URL || "https://url-shortener-api-u2vv.onrender.com"
).replace(/\/$/, "");

// Base used when showing short links. Set VITE_SHORT_URL_BASE if you attach a custom domain.
export const SHORT_BASE = (import.meta.env.VITE_SHORT_URL_BASE || API_URL).replace(/\/$/, "");
export const shortLink = (code) => `${SHORT_BASE}/${code}`;

/* ---------- free-tier cold start handling ---------- */
const listeners = new Set();
let waking = false;
const setWaking = (v) => {
  waking = v;
  listeners.forEach((fn) => fn());
};
export const subscribeWaking = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
export const getWaking = () => waking;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let lastAwake = 0;
const FRESH_MS = 4 * 60 * 1000;

async function ping(timeoutMs = 8000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_URL}/api/health`, { signal: ctrl.signal, cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

let wakePromise = null;
/** Resolves true once the backend answers. Shows the "waking up" banner if it takes longer than ~2s. */
export function ensureAwake() {
  if (Date.now() - lastAwake < FRESH_MS) return Promise.resolve(true);
  if (!wakePromise) {
    wakePromise = (async () => {
      const bannerTimer = setTimeout(() => setWaking(true), 2000);
      const deadline = Date.now() + 150000;
      try {
        while (Date.now() < deadline) {
          if (await ping()) {
            lastAwake = Date.now();
            return true;
          }
          await sleep(2500);
        }
        return false;
      } finally {
        clearTimeout(bannerTimer);
        setWaking(false);
        wakePromise = null;
      }
    })();
  }
  return wakePromise;
}

async function send(path, { method = "GET", body, token } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    const err = new Error("Cannot reach the server. Please try again.");
    err.network = true;
    throw err;
  }
  lastAwake = Date.now();

  const text = await res.text();
  let data = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    /* plain text response */
  }

  if (!res.ok) {
    const message =
      (data && data.message) ||
      (res.status === 401 || res.status === 403
        ? "Session expired or invalid credentials"
        : "Something went wrong");
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

async function request(path, opts) {
  await ensureAwake();
  try {
    return await send(path, opts);
  } catch (e) {
    if (!e.network) throw e;
    lastAwake = 0; // server probably went to sleep in between, wake it and retry once
    if (await ensureAwake()) return send(path, opts);
    throw e;
  }
}

export const api = {
  login: (username, password) =>
    request("/api/auth/public/login", { method: "POST", body: { username, password } }),
  register: (username, email, password) =>
    request("/api/auth/public/register", {
      method: "POST",
      body: { username, email, password },
    }),
  shorten: (originalUrl, token) =>
    request("/api/urls/shorten", { method: "POST", body: { originalUrl }, token }),
  myUrls: (token) => request("/api/urls/myurls", { token }),
  totalClicks: (start, end, token) =>
    request(`/api/urls/totalClicks?startdate=${start}&enddate=${end}`, { token }),
  analytics: (code, start, end, token) =>
    request(
      `/api/urls/analytics/${code}?startdate=${start}T00:00:00&enddate=${end}T23:59:59`,
      { token }
    ),
  remove: (id, token) => request(`/api/urls/${id}`, { method: "DELETE", token }),
};
