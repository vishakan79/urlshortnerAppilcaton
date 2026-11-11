export const API_URL = (
  import.meta.env.VITE_API_URL || "https://url-shortener-api-u2vv.onrender.com"
).replace(/\/$/, "");

export const shortLink = (code) => `${API_URL}/${code}`;

async function request(path, { method = "GET", body, token } = {}) {
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
    throw new Error("Server is waking up. Please try again in a few seconds.");
  }

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

export const api = {
  health: () => request("/api/health").catch(() => null),
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
};
