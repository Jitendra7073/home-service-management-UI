/**
 * Custom React Query Hooks
 * Provides cached API queries with automatic cache management
 * Reduces API calls and improves performance
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_CACHE_CONFIG, queryKeys } from "@/lib/query-config";

// ============= CUSTOMER HOOKS =============

/**
 * Fetch customer bookings with pagination
 * Caches for 5 minutes, auto-refetch on window focus
 */
export function useCustomerBookings(page = 1, limit = 20) {
    return useQuery({
        queryKey: queryKeys.customer.bookings(page, limit),
        queryFn: async () => {
            const res = await fetch(
                `/api/v1/customer/bookings?page=${page}&limit=${limit}`
            );
            if (!res.ok) throw new Error("Failed to fetch bookings");
            return res.json();
        },
        ...QUERY_CACHE_CONFIG.BOOKINGS,
    });
}

/**
 * Fetch all providers with pagination and filtering
 * Caches for 10 minutes
 */
export function useProvidersList(page = 1, limit = 20, filters?: any) {
    return useQuery({
        queryKey: queryKeys.customer.providers(page, limit, filters),
        queryFn: async () => {
            const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
            if (filters) {
                Object.entries(filters).forEach(([key, value]) => {
                    if (value) params.append(key, String(value));
                });
            }
            const res = await fetch(`/api/v1/customer/providers?${params.toString()}`);
            if (!res.ok) throw new Error("Failed to fetch providers");
            return res.json();
        },
        ...QUERY_CACHE_CONFIG.PROVIDERS,
    });
}

/**
 * Fetch single provider details
 * Caches for 5 minutes
 */
export function useProviderDetails(providerId: string) {
    return useQuery({
        queryKey: queryKeys.customer.providerDetails(providerId),
        queryFn: async () => {
            const res = await fetch(`/api/v1/customer/providers/${providerId}`);
            if (!res.ok) throw new Error("Failed to fetch provider");
            return res.json();
        },
        enabled: !!providerId,
        ...QUERY_CACHE_CONFIG.PROVIDER_DETAILS,
    });
}

// ============= PROVIDER HOOKS =============

/**
 * Fetch provider's own bookings with pagination
 * Caches for 5 minutes, real-time updates on refocus
 */
export function useProviderBookings(page = 1, limit = 20) {
    return useQuery({
        queryKey: queryKeys.provider.bookings(page, limit),
        queryFn: async () => {
            const res = await fetch(
                `/api/v1/provider/bookings?page=${page}&limit=${limit}`
            );
            if (!res.ok) throw new Error("Failed to fetch provider bookings");
            return res.json();
        },
        ...QUERY_CACHE_CONFIG.BOOKINGS,
    });
}

/**
 * Fetch provider services
 * Caches for 10 minutes
 */
export function useProviderServices() {
    return useQuery({
        queryKey: queryKeys.provider.services,
        queryFn: async () => {
            const res = await fetch("/api/v1/provider/service");
            if (!res.ok) throw new Error("Failed to fetch services");
            return res.json();
        },
        ...QUERY_CACHE_CONFIG.SERVICES,
    });
}

/**
 * Fetch provider slots
 * Caches for 15 minutes
 */
export function useProviderSlots() {
    return useQuery({
        queryKey: queryKeys.provider.slots,
        queryFn: async () => {
            const res = await fetch("/api/v1/provider/slots");
            if (!res.ok) throw new Error("Failed to fetch slots");
            return res.json();
        },
        ...QUERY_CACHE_CONFIG.SLOTS,
    });
}

/**
 * Fetch subscription/pricing plans
 * Static data - cached indefinitely
 */
export function useSubscriptionPlans() {
    return useQuery({
        queryKey: queryKeys.provider.subscription,
        queryFn: async () => {
            const res = await fetch("/api/v1/provider/subscription");
            if (!res.ok) throw new Error("Failed to fetch subscription plans");
            return res.json();
        },
        ...QUERY_CACHE_CONFIG.SUBSCRIPTION,
    });
}

// ============= COMMON HOOKS =============

/**
 * Fetch user profile
 * Caches for 30 minutes, auto-refetch on window focus
 */
export function useUserProfile() {
    return useQuery({
        queryKey: queryKeys.common.profile,
        queryFn: async () => {
            const res = await fetch("/api/common/profile");
            if (!res.ok) throw new Error("Failed to fetch profile");
            return res.json();
        },
        ...QUERY_CACHE_CONFIG.PROFILE,
    });
}

/**
 * Fetch user addresses
 * Caches for 30 minutes
 */
export function useUserAddresses() {
    return useQuery({
        queryKey: queryKeys.common.addresses,
        queryFn: async () => {
            const res = await fetch("/api/v1/common/addresses");
            if (!res.ok) throw new Error("Failed to fetch addresses");
            return res.json();
        },
        ...QUERY_CACHE_CONFIG.PROFILE,
    });
}

/**
 * Fetch business categories
 * Static data - cached indefinitely
 */
export function useCategories() {
    return useQuery({
        queryKey: queryKeys.common.categories,
        queryFn: async () => {
            const res = await fetch("/api/v1/common/categories");
            if (!res.ok) throw new Error("Failed to fetch categories");
            return res.json();
        },
        ...QUERY_CACHE_CONFIG.CATEGORIES,
    });
}

/**
 * Fetch notifications
 * Real-time data - refetches frequently
 */
export function useNotifications() {
    return useQuery({
        queryKey: queryKeys.common.notifications,
        queryFn: async () => {
            const res = await fetch("/api/v1/common/notifications");
            if (!res.ok) throw new Error("Failed to fetch notifications");
            return res.json();
        },
        ...QUERY_CACHE_CONFIG.NOTIFICATIONS,
    });
}

// ============= MUTATION HOOKS =============

/**
 * Hook for invalidating cache after mutations
 * Useful for keeping data fresh after updates
 */
export function useInvalidateCache() {
    const queryClient = useQueryClient();

    return {
        invalidateBookings: () =>
            queryClient.invalidateQueries({ queryKey: queryKeys.customer.bookmark }),
        invalidateProfile: () =>
            queryClient.invalidateQueries({ queryKey: queryKeys.common.profile }),
        invalidateServices: () =>
            queryClient.invalidateQueries({ queryKey: queryKeys.provider.services }),
        invalidateSlots: () =>
            queryClient.invalidateQueries({ queryKey: queryKeys.provider.slots }),
        invalidateProviders: () =>
            queryClient.invalidateQueries({
                queryKey: ["customer", "providers"],
            }),
        invalidateNotifications: () =>
            queryClient.invalidateQueries({ queryKey: queryKeys.common.notifications }),
        invalidateAll: () => queryClient.invalidateQueries(),
    };
}

/**
 * Hook for prefetching data
 * Load data before user navigates to it (improves perceived performance)
 */
export function usePrefetchData() {
    const queryClient = useQueryClient();

    return {
        prefetchProviderDetails: (providerId: string) =>
            queryClient.prefetchQuery({
                queryKey: queryKeys.customer.providerDetails(providerId),
                queryFn: async () => {
                    const res = await fetch(`/api/v1/customer/providers/${providerId}`);
                    if (!res.ok) throw new Error("Failed to fetch provider");
                    return res.json();
                },
                staleTime: QUERY_CACHE_CONFIG.PROVIDER_DETAILS.staleTime,
            }),

        prefetchProviders: (page = 1, limit = 20) =>
            queryClient.prefetchQuery({
                queryKey: queryKeys.customer.providers(page, limit),
                queryFn: async () => {
                    const res = await fetch(
                        `/api/v1/customer/providers?page=${page}&limit=${limit}`
                    );
                    if (!res.ok) throw new Error("Failed to fetch providers");
                    return res.json();
                },
                staleTime: QUERY_CACHE_CONFIG.PROVIDERS.staleTime,
            }),

        prefetchBookings: (page = 1, limit = 20) =>
            queryClient.prefetchQuery({
                queryKey: queryKeys.customer.bookings(page, limit),
                queryFn: async () => {
                    const res = await fetch(
                        `/api/v1/customer/bookings?page=${page}&limit=${limit}`
                    );
                    if (!res.ok) throw new Error("Failed to fetch bookings");
                    return res.json();
                },
                staleTime: QUERY_CACHE_CONFIG.BOOKINGS.staleTime,
            }),
    };
}
