import { toast } from "sonner";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T;
  headers: Headers;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        credentials: "include", // Sends refresh cookie
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const accessToken = localStorage.getItem("accessToken");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include", // For refresh cookie
    });

    if (response.status === 401) {
      // Try to refresh token
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry the request with new token
        const newAccessToken = localStorage.getItem("accessToken");
        headers.Authorization = `Bearer ${newAccessToken}`;
        const retryResponse = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });

        if (retryResponse.ok) {
          const text = await retryResponse.text();
          let data: any = null;
          if (text) {
            try {
              data = JSON.parse(text);
            } catch {
              data = text;
            }
          }
          return {
            ok: retryResponse.ok,
            status: retryResponse.status,
            data,
            headers: retryResponse.headers,
          };
        }
      }

      // Refresh failed, redirect to login
      localStorage.removeItem("accessToken");
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
        window.location.href = "/auth/login";
      }
      throw new Error("Authentication failed");
    }

    const text = await response.text();
    let data: any = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      headers: response.headers,
    };
  }

  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request(endpoint, { ...options, method: "GET" });
  }

  async post<T = any>(endpoint: string, data?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(endpoint: string, data?: any, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Setup automatic token refresh
let refreshInterval: NodeJS.Timeout | null = null;

export const setupTokenRefresh = () => {
  if (refreshInterval) return; // Already set up

  refreshInterval = setInterval(async () => {
    try {
      const response = await fetch("/api/auth/refresh-token", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }
      }
    } catch (error) {
      console.error("Automatic token refresh failed:", error);
      // Optionally redirect to login if refresh fails
    }
  }, 10 * 60 * 1000); // Every 10 minutes
};

// Check auth on app init
export const checkAuth = async () => {
  try {
    const response = await apiClient.get("/api/v1/user/profile");
    if (response.ok) {
      return response.data;
    }
    return null;
  } catch (error) {
    return null;
  }
};