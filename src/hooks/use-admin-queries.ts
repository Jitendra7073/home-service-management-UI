import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// --------------------- QUERY KEYS ---------------------
export const adminQueryKeys = {
  dashboard: ["admin", "dashboard"] as const,
  analytics: ["admin", "dashboard", "analytics"] as const,
  users: (filters?: any) => ["admin", "users", filters] as const,
  user: (userId: string) => ["admin", "user", userId] as const,
  businesses: (filters?: any) => ["admin", "businesses", filters] as const,
  business: (businessId: string) => ["admin", "business", businessId] as const,
  businessServices: (businessId: string) =>
    ["admin", "business", businessId, "services"] as const,
  services: (filters?: any) => ["admin", "services", filters] as const,
  service: (serviceId: string) => ["admin", "service", serviceId] as const,
  categories: (limit: number) => ["admin", "categories", limit] as const,
};

// --------------------- QUERY CACHE CONFIG ---------------------
export const ADMIN_CACHE_CONFIG = {
  DASHBOARD: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  },
  USERS: {
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  },
  BUSINESSES: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  },
  SERVICES: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  },
  CATEGORIES: {
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
  },
};

// --------------------- DASHBOARD HOOKS ---------------------

export function useAdminDashboardStats() {
  return useQuery({
    queryKey: adminQueryKeys.dashboard,
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      const data = await res.json();
      return data;
    },
    ...ADMIN_CACHE_CONFIG.DASHBOARD,
  });
}

export function useAdminDashboardAnalytics() {
  return useQuery({
    queryKey: adminQueryKeys.analytics,
    queryFn: async () => {
      const res = await fetch("/api/admin/dashboard/analytics");
      if (!res.ok) throw new Error("Failed to fetch dashboard analytics");
      const data = await res.json();
      return data;
    },
    ...ADMIN_CACHE_CONFIG.DASHBOARD,
  });
}

// --------------------- USER MANAGEMENT HOOKS ---------------------

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users", "all"],
    queryFn: async () => {
      // Fetching with a high limit to simulate "all" for client-side filtering
      const res = await fetch(`/api/admin/users?limit=1000`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      return data;
    },
    ...ADMIN_CACHE_CONFIG.USERS,
  });
}

export function useAdminUserDetails(userId: string) {
  return useQuery({
    queryKey: adminQueryKeys.user(userId),
    queryFn: async () => {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user details");
      const data = await res.json();
      return data;
    },
    enabled: !!userId,
  });
}

export function useRestrictUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      reason,
    }: {
      userId: string;
      reason: string;
    }) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restrict", reason }),
      });
      if (!res.ok) throw new Error("Failed to restrict user");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "user", variables.userId],
      });
      toast.success("User restricted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to restrict user");
    },
  });
}

export function useLiftUserRestriction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lift-restriction" }),
      });
      if (!res.ok) throw new Error("Failed to lift restriction");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "user", variables],
      });
      toast.success("User restriction lifted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to lift restriction");
    },
  });
}

// --------------------- BUSINESS MANAGEMENT HOOKS ---------------------

export function useAdminBusinesses() {
  return useQuery({
    queryKey: ["admin", "businesses", "all"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/businesses?limit=1000`);
      if (!res.ok) throw new Error("Failed to fetch businesses");
      const data = await res.json();
      return data;
    },
    ...ADMIN_CACHE_CONFIG.BUSINESSES,
  });
}

export function useAdminBusinessDetails(businessId: string) {
  return useQuery({
    queryKey: adminQueryKeys.business(businessId),
    queryFn: async () => {
      const res = await fetch(`/api/admin/businesses/${businessId}`);
      if (!res.ok) throw new Error("Failed to fetch business details");
      const data = await res.json();
      return data;
    },
    enabled: !!businessId,
  });
}

export function useAdminBusinessServices(businessId: string) {
  return useQuery({
    queryKey: adminQueryKeys.businessServices(businessId),
    queryFn: async () => {
      const res = await fetch(`/api/admin/businesses/${businessId}/services`);
      if (!res.ok) throw new Error("Failed to fetch business services");
      const data = await res.json();
      return data;
    },
    enabled: !!businessId,
  });
}

export function useApproveBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (businessId: string) => {
      const res = await fetch(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      if (!res.ok) throw new Error("Failed to approve business");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "businesses"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "business", variables],
      });
      toast.success("Business approved successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve business");
    },
  });
}

export function useRejectBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      businessId,
      reason,
    }: {
      businessId: string;
      reason?: string;
    }) => {
      const res = await fetch(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason }),
      });
      if (!res.ok) throw new Error("Failed to reject business");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "businesses"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "business", variables.businessId],
      });
      toast.success("Business rejected successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject business");
    },
  });
}

export function useRestrictBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      businessId,
      reason,
    }: {
      businessId: string;
      reason: string;
    }) => {
      const res = await fetch(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restrict", reason }),
      });
      if (!res.ok) throw new Error("Failed to restrict business");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "businesses"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "business", variables.businessId],
      });
      toast.success("Business restricted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to restrict business");
    },
  });
}

export function useLiftBusinessRestriction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (businessId: string) => {
      const res = await fetch(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lift-restriction" }),
      });
      if (!res.ok) throw new Error("Failed to lift restriction");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "businesses"] });
      queryClient.invalidateQueries({
        queryKey: ["admin", "business", variables],
      });
      toast.success("Business restriction lifted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to lift restriction");
    },
  });
}

// --------------------- SERVICE MANAGEMENT HOOKS ---------------------

export function useAdminServices() {
  return useQuery({
    queryKey: ["admin", "services", "all"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/services?limit=1000`);
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      return data;
    },
    ...ADMIN_CACHE_CONFIG.SERVICES,
  });
}

export function useRestrictService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      serviceId,
      reason,
    }: {
      serviceId: string;
      reason: string;
    }) => {
      const res = await fetch(`/api/admin/services/${serviceId}/restrict`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Failed to restrict service");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "business"] });
      toast.success("Service restricted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to restrict service");
    },
  });
}

export function useLiftServiceRestriction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      const res = await fetch(
        `/api/admin/services/${serviceId}/lift-restriction`,
        {
          method: "PATCH",
        },
      );
      if (!res.ok) throw new Error("Failed to lift restriction");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "business"] });
      toast.success("Service restriction lifted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to lift restriction");
    },
  });
}

export function useBusinessCategories(limit = 100) {
  return useQuery({
    queryKey: adminQueryKeys.categories(limit),
    queryFn: async () => {
      const res = await fetch(`/api/admin/categories?limit=${limit}`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      return data;
    },
    ...ADMIN_CACHE_CONFIG.CATEGORIES,
  });
}
