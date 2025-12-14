"use client";

import { CartesianGrid, Line, LineChart, XAxis, Area, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { monthlyAnalysisData } from "@/components/provider/dashboard/dashboardStats";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";


const chartConfig = {
  desktop: {
    label: "Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const RevenueChart = (
  { data, isLoading }: { data: any; isLoading: boolean }
) => {

  const chartData = data;

  if (isLoading) {
    return (
      <Card className="w-full shadow-sm border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Revenue Chart</CardTitle>
          <CardDescription>Monthly revenue analysis</CardDescription>
        </CardHeader>
        <CardContent className="w-full h-64 flex items-center justify-center">
          <div className="flex flex-col justify-center items-center space-y-2 text-gray-500"><Spinner className="h-8 w-8" /><span className="text-sm">Loading Chart Data...</span></div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full shadow-sm border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Revenue Chart
          </CardTitle>
          <CardDescription>No revenue data available</CardDescription>
          <CardContent className="w-full h-64 flex items-center justify-center">
            <Image
              src="/images/p/no-graph-data.png"
              alt="No Data"
              width={200}
              height={200}
              className="opacity-50"
            />
          </CardContent>
        </CardHeader>
      </Card>
    );
  }


  return (
    <Card className="w-full shadow-sm border rounded-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Revenue Chart</CardTitle>
        <CardDescription>Monthly revenue analysis</CardDescription>
      </CardHeader>

      <CardContent className="w-full">
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
            {/* Grid */}
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            {/* Months label */}
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            {/* Tooltip */}
            <ChartTooltip content={<ChartTooltipContent />} />

            {/* Soft area under line */}
            <Area
              dataKey="earnings"
              type="monotone"
              stroke="var(--color-desktop)"
              fill="var(--color-desktop)"
              fillOpacity={0.1}
            />

            {/* Main line */}
            <Line
              dataKey="earnings"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
