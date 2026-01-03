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

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    // Note: Tokens are now handled via httpOnly cookies
    // No need to manually attach Authorization header

    const makeRequest = async (): Promise<Response> => {
      return await fetch(url, {
        ...options,
        headers,
        credentials: "include", // Sends cookies automatically
      });
    };

    let response = await makeRequest();

    // If 401, try to refresh token once
    if (response.status === 401 && !endpoint.includes("/auth/")) {
      try {
        // Attempt token refresh
        const refreshResponse = await fetch("/api/auth/refresh-session", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (refreshResponse.ok) {
          // Retry original request with new token
          response = await makeRequest();
        } else {
          // Refresh failed, redirect to login
          if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
            window.location.href = "/auth/login";
          }
          throw new Error("Session expired. Please login again.");
        }
      } catch (error) {
        // Refresh failed, redirect to login
        if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
          window.location.href = "/auth/login";
        }
        throw new Error("Session expired. Please login again.");
      }
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

// Note: Token refresh is now handled automatically by middleware
// No need for manual token refresh logic

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