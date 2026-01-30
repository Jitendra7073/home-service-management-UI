"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Spinner } from "@/components/ui/spinner";

interface AdminRevenueChartProps {
  data: {
    month: string;
    platformFees: number;
    subscriptionRevenue: number;
  }[];
  isLoading: boolean;
}

const AdminRevenueChart: React.FC<AdminRevenueChartProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center border rounded-md">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[250px] flex items-center justify-center border rounded-md bg-muted/10">
        <p className="text-sm text-muted-foreground">No revenue data</p>
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#16a34a" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number, name: string) => [`₹ ${value}`, name]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="platformFees"
            stroke="#16a34a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorFees)"
            name="Platform Fees"
          />
          <Area
            type="monotone"
            dataKey="subscriptionRevenue"
            stroke="#2563eb"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorSubs)"
            name="Subscription Revenue"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdminRevenueChart;
