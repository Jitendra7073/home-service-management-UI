"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
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

interface ServiceChartProps {
  data: {
    service: string;
    totalBookings: number;
  }[];
  isLoading: boolean;
}

const COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b", "#10b981"];

const ServiceChart: React.FC<ServiceChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full shadow-sm border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Popular Services
          </CardTitle>
          <CardDescription>Top 5 most booked services</CardDescription>
        </CardHeader>
        <CardContent className="w-full h-[300px] flex items-center justify-center">
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
      <Card className="w-full shadow-sm border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Popular Services
          </CardTitle>
          <CardDescription>No booking data available</CardDescription>
        </CardHeader>
        <CardContent className="w-full h-[300px] flex items-center justify-center">
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
    <Card className="w-full shadow-sm border rounded-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Top Performing Services
        </CardTitle>
        <CardDescription>
          Services with the highest number of bookings
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
              barSize={32}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="service"
                type="category"
                tickLine={false}
                axisLine={false}
                width={150}
                tick={{ fontSize: 13, fill: "#4b5563", fontWeight: 500 }}
              />
              <Tooltip
                cursor={{ fill: "transparent" }}
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [`${value} Bookings`, "Volume"]}
              />
              <Bar
                dataKey="totalBookings"
                radius={[0, 4, 4, 0]}
                background={{ fill: "#f3f4f6" }}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceChart;
