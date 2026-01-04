/**
 * Query Cache Configuration
 * Defines cache durations and refetch strategies for all API queries
 * This ensures minimal API calls and optimal performance
 */

export const QUERY_CACHE_CONFIG = {
    // Static/rarely changing data
    STATIC: {
        staleTime: Infinity, // Never stale
        gcTime: 24 * 60 * 60 * 1000, // 24 hours garbage collection
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    },

    // Semi-static data (changes occasionally)
    SEMI_STATIC: {
        staleTime: 60 * 60 * 1000, // 1 hour
        gcTime: 24 * 60 * 60 * 1000, // 24 hours
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
    },

    // User profile data (changes when user updates)
    PROFILE: {
        staleTime: 30 * 60 * 1000, // 30 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
    },

    // Real-time data (changes frequently)
    BOOKINGS: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    },

    // Cart data (changes with user actions)
    CART: {
        staleTime: 2 * 60 * 1000, // 2 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    },

    // Notifications (real-time)
    NOTIFICATIONS: {
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    },

    // Business categories (rarely changes)
    CATEGORIES: {
        staleTime: Infinity,
        gcTime: 24 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    },

    // Provider list (changes when providers join/leave)
    PROVIDERS: {
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: false,
    },

    // Single provider details
    PROVIDER_DETAILS: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
    },

    // Services
    SERVICES: {
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
    },

    // Subscription/Pricing (rarely changes)
    SUBSCRIPTION: {
        staleTime: Infinity,
        gcTime: 24 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    },

    // Slots (changes when provider updates)
    SLOTS: {
        staleTime: 15 * 60 * 1000, // 15 minutes
        gcTime: 60 * 60 * 1000, // 1 hour
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
    },

    // Payment data
    PAYMENTS: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true,
    },
};

/**
 * Query Key Factory
 * Centralized query key management to ensure consistency
 * and prevent cache misses due to key inconsistencies
 */
export const queryKeys = {
    // Customer
    customer: {
        all: ["customer"],
        bookings: (page?: number, limit?: number) => [
            "customer",
            "bookings",
            { page, limit },
        ],
        bookmark: ["customer", "bookings"],
        providers: (page?: number, limit?: number, filters?: any) => [
            "customer",
            "providers",
            { page, limit, ...filters },
        ],
        providerDetails: (providerId: string) => [
            "customer",
            "providers",
            providerId,
        ],
    },

    // Provider
    provider: {
        all: ["provider"],
        bookings: (page?: number, limit?: number) => [
            "provider",
            "bookings",
            { page, limit },
        ],
        services: ["provider", "services"],
        serviceDetail: (serviceId: string) => ["provider", "services", serviceId],
        slots: ["provider", "slots"],
        subscription: ["provider", "subscription"],
        analytics: ["provider", "analytics"],
    },

    // Common
    common: {
        profile: ["common", "profile"],
        addresses: ["common", "addresses"],
        categories: ["common", "categories"],
        notifications: ["common", "notifications"],
    },

    // Auth
    auth: {
        me: ["auth", "me"],
        session: ["auth", "session"],
    },
};
