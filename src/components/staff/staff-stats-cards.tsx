import { Card, CardContent } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, IndianRupee } from "lucide-react";

interface StaffStatsCardsProps {
  stats: {
    pendingBookings: number;
    inProgressBookings: number;
    completedBookings: number;
    totalEarnings: number;
  };
  isLoading?: boolean;
}

export default function StaffStatsCards({
  stats,
  isLoading = false,
}: StaffStatsCardsProps) {
  const statItems = [
    {
      title: "Pending Bookings",
      value: stats.pendingBookings,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "In Progress",
      value: stats.inProgressBookings,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Completed",
      value: stats.completedBookings,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Earnings",
      value: `₹${stats.totalEarnings}`,
      icon: IndianRupee,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`${stat.bgColor} border-0 shadow-sm hover:shadow-md transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {isLoading ? (
                      <span className="animate-pulse">---</span>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
