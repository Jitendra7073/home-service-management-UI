"use client";

import { useDashboardStats } from "@/lib/hooks/useAdminApi";
import { StatsGrid } from "@/components/admin/dashboard/stats-grid";
import { QuickActions } from "@/components/admin/dashboard/quick-actions";
import { AlertsSection } from "@/components/admin/dashboard/alerts-section";

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useDashboardStats();

  if (error) {
    console.error("[Admin Dashboard] Error loading stats:", error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard. Here's what's happening on the platform.
        </p>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats || null} isLoading={isLoading} />

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
