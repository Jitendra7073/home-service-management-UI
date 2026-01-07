"use client";

import { useAdminDashboardStats } from "@/hooks/use-admin-queries";
import { StatsGrid } from "@/components/admin/dashboard/stats-grid";
import { QuickActions } from "@/components/admin/dashboard/quick-actions";
import { AlertsSection } from "@/components/admin/dashboard/alerts-section";
import { AdminAnalyticsCharts } from "@/components/admin/dashboard/AdminAnalyticsCharts";

export function DashboardClient() {
    const { data: response, isLoading, error } = useAdminDashboardStats();

    const stats = response?.data;

    if (error) {
        console.error("[Admin Dashboard] Error loading stats:", error);
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Stats Grid */}
            {error ? (
                <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
                    <h3 className="font-semibold">Error loading stats</h3>
                    <p>{error.message || "Failed to load dashboard statistics. Please try again."}</p>
                </div>
            ) : (
                <StatsGrid stats={stats || null} isLoading={isLoading} />
            )}

            {/* Analytics Charts */}
            <AdminAnalyticsCharts />

            {/* Quick Actions */}
            <QuickActions />

            {/* Alerts */}
            <AlertsSection
                restrictedUsers={stats?.users?.restricted}
                restrictedBusinesses={stats?.businesses?.restricted}
            />
        </div>
    );
}
