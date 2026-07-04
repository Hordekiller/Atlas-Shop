import { API_URL } from "./media";

export { API_URL };

async function getToken(): Promise<string | null> {
  return null;
}

export async function setToken(_token: string | null): Promise<void> {
  // No-op: token is managed via httpOnly cookie
}

export const api = {
  get: async <T>(path: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${API_URL}${path}`, {
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    if (!res.ok) {
      const err = await res
        .json()
        .catch(() => ({ message: "خطا در ارتباط با سرور" }));
      throw new Error(err.message || err.error || "خطا");
    }
    return res.json();
  },

  post: async <T>(
    path: string,
    body?: unknown,
    options?: RequestInit,
  ): Promise<T> => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "خطا" }));
      throw new Error(err.message || "خطا");
    }
    return res.json();
  },

  put: async <T>(
    path: string,
    body?: unknown,
    options?: RequestInit,
  ): Promise<T> => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "خطا" }));
      throw new Error(err.message || "خطا");
    }
    return res.json();
  },

  delete: async <T>(path: string, options?: RequestInit): Promise<T> => {
    const res = await fetch(`${API_URL}${path}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: "خطا" }));
      throw new Error(err.message || "خطا");
    }
    return res.json();
  },
};
