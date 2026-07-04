const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const safeLocalStorage = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // quota exceeded or storage unavailable
    }
  },
  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(key);
    } catch {
      // storage unavailable
    }
  },
};

class ApiClient {
  private token?: string;
  private maxRetries = 3;

  constructor() {
    this.token = safeLocalStorage.getItem("atlas_token") || undefined;
  }

  setToken(token: string) {
    this.token = token;
    safeLocalStorage.setItem("atlas_token", token);
  }

  clearToken() {
    this.token = undefined;
    safeLocalStorage.removeItem("atlas_token");
  }

  private async request<T>(
    path: string,
    options: RequestInit = {},
    attempt = 1,
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 429 && attempt <= this.maxRetries) {
        const retryAfter = response.headers.get("Retry-After");
        const delay = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : Math.min(1000 * Math.pow(2, attempt), 8000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request<T>(path, options, attempt + 1);
      }
      const error = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  put<T>(path: string, body?: unknown) {
    return this.request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  delete<T>(path: string) {
    return this.request<T>(path, { method: "DELETE" });
  }

  async login(email: string, password: string) {
    const result = await this.post<{ user: any; token: string }>(
      "/auth/login",
      { email, password },
    );
    this.setToken(result.token);
    return result;
  }

  async register(data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    const result = await this.post<{ user: any; token: string }>(
      "/auth/register",
      data,
    );
    this.setToken(result.token);
    return result;
  }

  async me() {
    return this.get<{ data: any }>("/auth/me");
  }

  async getProducts(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return this.get<{ data: any[] }>(`/products${query}`);
  }

  async getCategories() {
    return this.get<{ data: any[] }>("/categories");
  }
}

export const api = new ApiClient();
export default ApiClient;
