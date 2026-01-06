import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Generic fetch function
async function fetchApi(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || "An error occurred");
  }

  return res.json();
}

// Dashboard stats hook
export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => fetchApi("/api/admin/dashboard"),
  });
}

// Users hooks
export function useUsers(role: string) {
  return useQuery({
    queryKey: ["admin-users", role],
    queryFn: () => fetchApi(`/api/admin/users?role=${role}&limit=100`),
  });
}

export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      fetchApi(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restrict", reason }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      fetchApi(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lift-restriction" }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

// Businesses hooks
export function useBusinesses(params: Record<string, string> = {}) {
  const queryString = new URLSearchParams(params).toString();

  return useQuery({
    queryKey: ["admin-businesses", params],
    queryFn: () => fetchApi(`/api/admin/businesses?${queryString}`),
  });
}

export function useApproveBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (businessId: string) =>
      fetchApi(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-businesses"] });
    },
  });
}

export function useRejectBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (businessId: string) =>
      fetchApi(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason: "Business rejected by admin" }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-businesses"] });
    },
  });
}

export function useBlockBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ businessId, reason }: { businessId: string; reason: string }) =>
      fetchApi(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restrict", reason }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-businesses"] });
    },
  });
}

export function useUnblockBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (businessId: string) =>
      fetchApi(`/api/admin/businesses/${businessId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lift-restriction" }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-businesses"] });
    },
  });
}

// User profile hook
export function useUserProfile() {
  return useQuery({
    queryKey: ["user-profile"],
    queryFn: () => fetchApi("/api/auth/profile"),
  });
}

// ==================== USER DETAILS ====================

interface UserDetails {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  mobile?: string;
  role: "customer" | "provider" | "admin";
  isRestricted: boolean;
  restrictionReason?: string;
  restrictedAt?: string;
  profileImage?: string;
  address?: string;
  createdAt: string;
  businesses?: Array<{
    _id: string;
    name: string;
    businessName?: string;
    isApproved: boolean;
    isRestricted: boolean;
  }>;
}

interface UserDetailsResponse {
  ok: boolean;
  user?: UserDetails;
  message?: string;
}

export function useUserDetails(userId: string) {
  return useQuery<UserDetails>({
    queryKey: ["admin-user-details", userId],
    queryFn: async () => {
      const data: UserDetailsResponse = await fetchApi(`/api/admin/users/${userId}`);
      if (data.ok && data.user) {
        return data.user;
      }
      throw new Error(data.message || "Failed to fetch user details");
    },
    enabled: !!userId,
  });
}

// ==================== BUSINESS DETAILS ====================

interface BusinessDetails {
  _id: string;
  name: string;
  businessName?: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  owner?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profileImage?: string;
  };
  user?: {
    _id: string;
    name: string;
    email: string;
  };
  address: string;
  phone?: string;
  email?: string;
  contactEmail?: string;
  phoneNumber?: string;
  isApproved: boolean;
  isRejected: boolean;
  isRestricted: boolean;
  restrictionReason?: string;
  images?: string[];
  createdAt: string;
  approvedAt?: string;
}

interface BusinessDetailsResponse {
  ok: boolean;
  business?: BusinessDetails;
  message?: string;
}

export function useBusinessDetails(businessId: string) {
  return useQuery<BusinessDetails>({
    queryKey: ["admin-business-details", businessId],
    queryFn: async () => {
      const data: BusinessDetailsResponse = await fetchApi(`/api/admin/businesses/${businessId}`);
      if (data.ok && data.business) {
        return data.business;
      }
      throw new Error(data.message || "Failed to fetch business details");
    },
    enabled: !!businessId,
  });
}

interface BusinessService {
  _id: string;
  name: string;
  description: string;
  duration: number;
  durationInMinutes?: number;
  price: number;
  currency?: string;
  isRestricted: boolean;
  restrictionReason?: string;
  isActive: boolean;
  averageRating?: number;
}

interface BusinessServicesResponse {
  ok: boolean;
  services?: BusinessService[];
  message?: string;
}

export function useBusinessServices(businessId: string) {
  return useQuery<BusinessService[]>({
    queryKey: ["admin-business-services", businessId],
    queryFn: async () => {
      const data: BusinessServicesResponse = await fetchApi(`/api/admin/businesses/${businessId}/services`);
      if (data.ok && data.services) {
        return data.services;
      }
      return [];
    },
    enabled: !!businessId,
  });
}

// ==================== SERVICES API ====================

interface Service {
  _id: string;
  name: string;
  description: string;
  durationInMinutes: number;
  duration?: number;
  price: number;
  currency: string;
  isActive: boolean;
  isRestricted: boolean;
  restrictionReason?: string;
  averageRating: number;
  reviewCount: number;
  business: {
    _id: string;
    businessName: string;
    name?: string;
  };
  category: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface ServicesResponse {
  success: boolean;
  data?: Service[];
  message?: string;
}

export function useServices(params: Record<string, string> = {}) {
  const queryString = new URLSearchParams(params).toString();

  return useQuery<Service[]>({
    queryKey: ["admin-services", params],
    queryFn: async () => {
      const data: ServicesResponse = await fetchApi(`/api/admin/services?${queryString}`);
      if (data.success && data.data) {
        return data.data;
      }
      return [];
    },
  });
}

export function useRestrictService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ serviceId, reason }: { serviceId: string; reason: string }) =>
      fetchApi(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restrict", reason }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["admin-business-services"] });
    },
  });
}

export function useLiftServiceRestriction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) =>
      fetchApi(`/api/admin/services/${serviceId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lift-restriction" }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-services"] });
      queryClient.invalidateQueries({ queryKey: ["admin-business-services"] });
    },
  });
}
