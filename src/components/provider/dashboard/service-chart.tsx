"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

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
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

interface ServiceChartProps {
  data: {
    service: string;
    totalBookings: number;
  }[];
  isLoading: boolean;
}

const chartConfig = {
  totalBookings: {
    label: "Bookings",
  },
} satisfies ChartConfig;

const ServiceChart: React.FC<ServiceChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full shadow-sm border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Popular Services</CardTitle>
          <CardDescription>Top 5 most booked services</CardDescription>
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
            Popular Services
          </CardTitle>
          <CardDescription>No booking data available</CardDescription>
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

  const chartData = data.map((item, index) => ({
    ...item,
    fill: `var(--chart-${(index % 5) + 1})`,
  }));

  return (
    <Card className="w-full shadow-sm border rounded-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Popular Services
        </CardTitle>
        <CardDescription>
          Top 5 most booked services
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 12, right: 24 }}
          >
            <YAxis
              dataKey="service"
              type="category"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 13 }}
            />

            <XAxis dataKey="totalBookings" type="number" hide />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />

            <Bar
              dataKey="totalBookings"
              layout="vertical"
              radius={[6, 6, 6, 6]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ServiceChart;
