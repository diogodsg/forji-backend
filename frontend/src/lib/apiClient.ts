const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://services.forji.io/forge";

export interface ApiOptions extends RequestInit {
  auth?: boolean;
}

function getToken() {
  return localStorage.getItem("auth:token");
}

export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (options.auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (res.status === 401) {
    throw new Error("unauthorized");
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch (e) {
    throw new Error(`Invalid JSON response for ${path}`);
  }
}

export function storeToken(token: string) {
  localStorage.setItem("auth:token", token);
}

export function clearToken() {
  localStorage.removeItem("auth:token");
}
