"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "Top performing services chart";

const chartData = [
  { service: "Haircut", visitors: 420, fill: "var(--chart-1)" },
  { service: "Facial", visitors: 310, fill: "var(--chart-2)" },
  { service: "Massage", visitors: 290, fill: "var(--chart-3)" },
  { service: "Pedicure", visitors: 180, fill: "var(--chart-4)" },
  { service: "Hair Color", visitors: 140, fill: "var(--chart-5)" },
];

const chartConfig = {
  visitors: {
    label: "Bookings",
  },
} satisfies ChartConfig;

export function ServiceChart() {
  const totalBookings = chartData.reduce((sum, s) => sum + s.visitors, 0);

  return (
    <Card className="w-full shadow-sm border rounded-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Popular Services
        </CardTitle>
        <CardDescription>Most booked services this month</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 20 }}
          >
            {/* Service Names */}
            <YAxis
              dataKey="service"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fontSize: 13 }}
            />

            {/* Count */}
            <XAxis dataKey="visitors" type="number" hide />

            {/* Tooltip */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />

            {/* Bar */}
            <Bar
              dataKey="visitors"
              layout="vertical"
              radius={[6, 6, 6, 6]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>

     
    </Card>
  );
}
