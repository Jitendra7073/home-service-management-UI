/**
 * Admin React Query Hooks
 * Provides cached API queries with automatic cache management
 * Follows the same pattern as customer/provider hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ============= QUERY KEYS =============
export const adminQueryKeys = {
  dashboard: ["admin", "dashboard"] as const,
  users: (filters?: any) => ["admin", "users", filters] as const,
  user: (userId: string) => ["admin", "user", userId] as const,
  businesses: (filters?: any) => ["admin", "businesses", filters] as const,
  business: (businessId: string) => ["admin", "business", businessId] as const,
  businessServices: (businessId: string) => ["admin", "business", businessId, "services"] as const,
  services: (filters?: any) => ["admin", "services", filters] as const,
  service: (serviceId: string) => ["admin", "service", serviceId] as const,
};

// ============= QUERY CACHE CONFIG =============
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
};

// ============= DASHBOARD HOOKS =============

/**
 * Fetch admin dashboard statistics
 */
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

// ============= USER MANAGEMENT HOOKS =============

/**
 * Fetch all users with pagination and filters
 */
export function useAdminUsers(params: {
  role?: string;
  page?: number;
  limit?: number;
  isRestricted?: boolean;
} = {}) {
  const queryString = new URLSearchParams();
  if (params.role) queryString.append("role", params.role);
  if (params.page) queryString.append("page", params.page.toString());
  if (params.limit) queryString.append("limit", params.limit.toString());
  if (params.isRestricted !== undefined) queryString.append("isRestricted", params.isRestricted.toString());

  return useQuery({
    queryKey: adminQueryKeys.users(params),
    queryFn: async () => {
      const res = await fetch(`/api/admin/users?${queryString.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      return data;
    },
    ...ADMIN_CACHE_CONFIG.USERS,
  });
}

/**
 * Fetch user details by ID
 */
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

/**
 * Restrict user mutation
 */
export function useRestrictUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restrict", reason }),
      });
      if (!res.ok) throw new Error("Failed to restrict user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User restricted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to restrict user");
    },
  });
}

/**
 * Lift user restriction mutation
 */
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User restriction lifted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to lift restriction");
    },
  });
}

// ============= BUSINESS MANAGEMENT HOOKS =============

/**
 * Fetch all businesses with pagination and filters
 */
export function useAdminBusinesses(params: {
  isApproved?: boolean;
  isRejected?: boolean;
  isRestricted?: boolean;
  categoryId?: string;
  page?: number;
  limit?: number;
} = {}) {
  const queryString = new URLSearchParams();
  if (params.isApproved !== undefined) queryString.append("isApproved", params.isApproved.toString());
  if (params.isRejected !== undefined) queryString.append("isRejected", params.isRejected.toString());
  if (params.isRestricted !== undefined) queryString.append("isRestricted", params.isRestricted.toString());
  if (params.categoryId) queryString.append("categoryId", params.categoryId);
  if (params.page) queryString.append("page", params.page.toString());
  if (params.limit) queryString.append("limit", params.limit.toString());

  return useQuery({
    queryKey: adminQueryKeys.businesses(params),
    queryFn: async () => {
      const res = await fetch(`/api/admin/businesses?${queryString.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch businesses");
      const data = await res.json();
      return data;
    },
    ...ADMIN_CACHE_CONFIG.BUSINESSES,
  });
}

/**
 * Fetch business details by ID
 */
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

/**
 * Fetch business services
 */
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

/**
 * Approve business mutation
 */
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "businesses"] });
      toast.success("Business approved successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve business");
    },
  });
}

/**
 * Reject business mutation
 */
export function useRejectBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ businessId, reason }: { businessId: string; reason?: string }) => {
      const res = await fetch(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason }),
      });
      if (!res.ok) throw new Error("Failed to reject business");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "businesses"] });
      toast.success("Business rejected successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject business");
    },
  });
}

/**
 * Restrict business mutation
 */
export function useRestrictBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ businessId, reason }: { businessId: string; reason: string }) => {
      const res = await fetch(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restrict", reason }),
      });
      if (!res.ok) throw new Error("Failed to restrict business");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "businesses"] });
      toast.success("Business restricted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to restrict business");
    },
  });
}

/**
 * Lift business restriction mutation
 */
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "businesses"] });
      toast.success("Business restriction lifted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to lift restriction");
    },
  });
}

// ============= SERVICE MANAGEMENT HOOKS =============

/**
 * Fetch all services with filters
 */
export function useAdminServices(params: {
  isRestricted?: boolean;
  isActive?: boolean;
  businessId?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
} = {}) {
  const queryString = new URLSearchParams();
  if (params.isRestricted !== undefined) queryString.append("isRestricted", params.isRestricted.toString());
  if (params.isActive !== undefined) queryString.append("isActive", params.isActive.toString());
  if (params.businessId) queryString.append("businessId", params.businessId);
  if (params.categoryId) queryString.append("categoryId", params.categoryId);
  if (params.page) queryString.append("page", params.page.toString());
  if (params.limit) queryString.append("limit", params.limit.toString());

  return useQuery({
    queryKey: adminQueryKeys.services(params),
    queryFn: async () => {
      const res = await fetch(`/api/admin/services?${queryString.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch services");
      const data = await res.json();
      return data;
    },
    ...ADMIN_CACHE_CONFIG.SERVICES,
  });
}

/**
 * Restrict service mutation
 */
export function useRestrictService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, reason }: { serviceId: string; reason: string }) => {
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

/**
 * Lift service restriction mutation
 */
export function useLiftServiceRestriction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      const res = await fetch(`/api/admin/services/${serviceId}/lift-restriction`, {
        method: "PATCH",
      });
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
