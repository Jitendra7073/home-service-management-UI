import { Users, Building2, List, Calendar, Clock, CheckCircle, Ban } from "lucide-react";
import { StatCard } from "../stat-card";

interface DashboardStats {
  users?: {
    total: number;
    customers: number;
    providers: number;
    restricted: number;
  };
  businesses?: {
    total: number;
    pending: number;
    approved: number;
    restricted: number;
  };
  services?: {
    total: number;
    restricted: number;
  };
  bookings?: {
    total: number;
  };
}

interface StatsGridProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export function StatsGrid({ stats, isLoading }: StatsGridProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <StatCard
              title=""
              value={0}
              icon={Users}
              isLoading={true}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={stats?.users?.total || 0}
        icon={Users}
        substats={[
          {
            label: "Customers",
            value: stats?.users?.customers || 0,
          },
          {
            label: "Providers",
            value: stats?.users?.providers || 0,
          },
        ]}
      />

      <StatCard
        title="Businesses"
        value={stats?.businesses?.total || 0}
        icon={Building2}
        substats={[
          {
            label: "Pending",
            value: stats?.businesses?.pending || 0,
            icon: Clock,
            iconColor: "text-yellow-600",
            textColor: "text-yellow-600",
          },
          {
            label: "Approved",
            value: stats?.businesses?.approved || 0,
            icon: CheckCircle,
            iconColor: "text-emerald-600",
            textColor: "text-emerald-600",
          },
        ]}
      />

      <StatCard
        title="Services"
        value={stats?.services?.total || 0}
        icon={List}
        substats={
          stats?.services && stats.services.restricted > 0
            ? [
                {
                  label: "Restricted",
                  value: stats.services.restricted,
                  icon: Ban,
                  iconColor: "text-destructive",
                  textColor: "text-destructive",
                },
              ]
            : undefined
        }
      />

      <StatCard
        title="Bookings"
        value={stats?.bookings?.total || 0}
        icon={Calendar}
        description="Total bookings across platform"
      />
    </div>
  );
}
