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
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Add request to queue while refreshing
  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  // Process queued requests after refresh
  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  // Attempt to refresh the access token
  private async refreshAccessToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.subscribeTokenRefresh(() => {
          resolve(true);
        });
      });
    }

    this.isRefreshing = true;

    try {
      const refreshResponse = await fetch("/api/auth/refresh-session", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (refreshResponse.ok) {
        this.onTokenRefreshed("success");
        this.isRefreshing = false;
        return true;
      } else {
        // Refresh failed - clear all subscribers and redirect
        this.refreshSubscribers = [];
        this.isRefreshing = false;

        // Only redirect if not already on login page
        if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
          // Show a toast message before redirecting
          toast.error("Your session has expired. Please log in again.");

          // Small delay to allow the toast to be seen
          setTimeout(() => {
            window.location.href = "/auth/login";
          }, 1500);
        }

        return false;
      }
    } catch (error) {
      // Network error or other issue
      this.refreshSubscribers = [];
      this.isRefreshing = false;

      console.error("Token refresh failed:", error);

      if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
        toast.error("Connection lost. Please log in again.");

        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 1500);
      }

      return false;
    }
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


    const makeRequest = async (): Promise<Response> => {
      return await fetch(url, {
        ...options,
        headers,
        credentials: "include", // Sends cookies automatically
      });
    };

    let response = await makeRequest();

    if (response.status === 401 && !endpoint.includes("/auth/")) {

      const refreshSuccess = await this.refreshAccessToken();

      if (refreshSuccess) {
        response = await makeRequest();
      } else {
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
