// vite (dev) and vercel (prod) proxy /api to the backend, so the cookie stays same-site

const BASE = "/api";
const RETRY_STATUSES = [502, 503, 504];

export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function apiRequest(path, { method = "GET", body, signal } = {}, attempt = 1) {
  let response;
  try {
    response = await fetch(`${BASE}${path}`, {
      method,
      signal,
      credentials: "include",
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError(0, "NETWORK_ERROR", "Couldn't reach the server. Check your connection and try again.");
  }

  // retry while render's free tier wakes up
  if (RETRY_STATUSES.includes(response.status) && method === "GET" && attempt < 3) {
    await wait(3000 * attempt);
    return apiRequest(path, { method, body, signal }, attempt + 1);
  }

  if (response.status === 204) return null;
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (RETRY_STATUSES.includes(response.status)) {
      throw new ApiError(response.status, "SERVER_UNAVAILABLE", "The server is starting up. Please try again in a few seconds.");
    }
    const error = data?.error;
    if (response.status === 401 && !path.startsWith("/auth/")) {
      window.dispatchEvent(new Event("auth:expired"));
    }
    throw new ApiError(
      response.status,
      error?.code ?? "HTTP_ERROR",
      error?.message ?? `The server responded with status ${response.status}.`,
      error?.details
    );
  }
  return data;
}

export const api = {
  me: () => apiRequest("/auth/me"),
  login: (email, password) => apiRequest("/auth/login", { method: "POST", body: { email, password } }),
  signup: (name, email, password) => apiRequest("/auth/signup", { method: "POST", body: { name, email, password } }),
  logout: () => apiRequest("/auth/logout", { method: "POST", body: {} }),
  dashboard: (query, signal) => apiRequest(`/analytics/dashboard${query ? `?${query}` : ""}`, { signal }),
  calls: (query, signal) => apiRequest(`/calls?${query}`, { signal }),
  users: (signal) => apiRequest("/users", { signal }),
  updateUserRole: (id, role) => apiRequest(`/users/${id}`, { method: "PATCH", body: { role } }),
};

export function fieldErrors(error) {
  return Object.fromEntries((error?.details ?? []).map((detail) => [detail.field, detail.message]));
}
