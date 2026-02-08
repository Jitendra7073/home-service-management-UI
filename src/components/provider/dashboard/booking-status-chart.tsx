"use client";

import * as React from "react";
import {
  Label,
  Pie,
  PieChart,
  Cell,
  Tooltip,
  ResponsiveContainer,
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

interface BookingStatusChartProps {
  data: {
    completed: number;
    confirmed: number;
    cancelled: number;
  };
  isLoading: boolean;
}

const BookingStatusChart = ({ data, isLoading }: BookingStatusChartProps) => {
  const chartData = React.useMemo(() => {
    if (!data) return [];
    return [
      { name: "Completed", value: data.completed, color: "#10b981" }, // emerald-500
      { name: "Confirmed", value: data.confirmed, color: "#3b82f6" }, // blue-500
      { name: "Cancelled", value: data.cancelled, color: "#ef4444" }, // red-500
    ].filter((item) => item.value > 0);
  }, [data]);

  const totalBookings = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [chartData]);

  if (isLoading) {
    return (
      <Card className="flex flex-col h-full shadow-sm border rounded-sm">
        <CardHeader className="items-center pb-0">
          <CardTitle>Booking Status</CardTitle>
          <CardDescription>Distribution of booking statuses</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 min-h-[250px] flex items-center justify-center">
          <div className="flex flex-col justify-center items-center space-y-2 text-gray-500">
            <Spinner className="h-8 w-8" />
            <span className="text-sm">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card className="flex flex-col h-full shadow-sm border rounded-sm">
        <CardHeader className="items-center pb-0">
          <CardTitle>Booking Status</CardTitle>
          <CardDescription>No bookings to display</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 min-h-[250px] flex items-center justify-center">
          <Image
            src="/images/p/no-graph-data.png"
            alt="No Data"
            width={150}
            height={150}
            className="opacity-50"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full shadow-sm border rounded-sm">
      <CardHeader className="items-center pb-0">
        <CardTitle>Booking Distribution</CardTitle>
        <CardDescription>Current status of all bookings</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="h-[250px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                itemStyle={{ color: "#374151" }}
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={85}
                strokeWidth={5}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={entry.color}
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle">
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold">
                            {totalBookings.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground text-xs">
                            Bookings
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingStatusChart;
