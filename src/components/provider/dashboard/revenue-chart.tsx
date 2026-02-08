"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

const RevenueChart = ({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) => {
  const chartData = data;

  if (isLoading) {
    return (
      <Card className="w-full shadow-sm border rounded-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Revenue Chart</CardTitle>
          <CardDescription>Monthly revenue analysis</CardDescription>
        </CardHeader>
        <CardContent className="w-full h-[350px] flex items-center justify-center">
          <div className="flex flex-col justify-center items-center space-y-2 text-gray-500">
            <Spinner className="h-8 w-8" />
            <span className="text-sm">Loading Chart Data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full shadow-sm border rounded-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Revenue Chart</CardTitle>
          <CardDescription>No revenue data available</CardDescription>
        </CardHeader>
        <CardContent className="w-full h-[350px] flex items-center justify-center">
          <Image
            src="/images/p/no-graph-data.png"
            alt="No Data"
            width={200}
            height={200}
            className="opacity-50"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-sm border rounded-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue Trends</CardTitle>
        <CardDescription>
          Visualize your earning performance over time.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
                tickFormatter={(value) => (value ? value.slice(0, 3) : "")}
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
                formatter={(value: number) => [`₹ ${value}`, "Earnings"]}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorEarnings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
