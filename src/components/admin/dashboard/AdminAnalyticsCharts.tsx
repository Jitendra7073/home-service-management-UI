"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ComposedChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAdminDashboardAnalytics } from "@/hooks/use-admin-queries";
import { Skeleton } from "@/components/ui/skeleton";

export function AdminAnalyticsCharts() {
  const { data: response, isLoading, error } = useAdminDashboardAnalytics();
  const analytics = response?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px] rounded-xl" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[350px] rounded-xl" />
          <Skeleton className="h-[350px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-800">
        Error loading analytics: {error?.message || "No data available"}
      </div>
    );
  }

  // Colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Merge Data for Combined Chart
  const allMonths = Array.from(
    new Set([
      ...analytics.bookings.monthly.map((i: any) => i.name),
      ...analytics.revenue.monthly.map((i: any) => i.name),
    ])
  ).sort();

  const combinedData = allMonths.map((month) => {
    const b = analytics.bookings.monthly.find((i: any) => i.name === month);
    const r = analytics.revenue.monthly.find((i: any) => i.name === month);
    return {
      name: month,
      bookings: b ? b.value : 0,
      revenue: r ? r.value : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Combined Trend Chart (Full Width) */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>
            Monthly Bookings (Area) vs Subscription Revenue (Bar)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={combinedData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <defs>
                  <linearGradient
                    id="colorBookings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.3}
                />
                <XAxis
                  dataKey="name"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  label={{
                    value: "Bookings",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                />
                <Legend wrapperStyle={{ paddingTop: "20px" }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="bookings"
                  name="Bookings"
                  stroke="#8884d8"
                  fill="url(#colorBookings)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue (₹)"
                  stroke="#0ea5e9"
                  fill="url(#colorRevenue)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Businesses */}
        <Card>
          <CardHeader>
            <CardTitle>Top Businesses</CardTitle>
            <CardDescription>By total bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.rankings.businesses}
                  layout="vertical"
                  margin={{ left: 20 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.3}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                    barSize={20}>
                    {analytics.rankings.businesses.map(
                      (entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Services */}
        <Card>
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
            <CardDescription>By popularity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.rankings.services}
                  layout="vertical"
                  margin={{ left: 20 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    opacity={0.3}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                    labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
                  />
                  <Bar
                    dataKey="bookings"
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                    barSize={20}>
                    {analytics.rankings.services.map(
                      (entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[(index + 2) % COLORS.length]}
                        />
                      )
                    )}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
