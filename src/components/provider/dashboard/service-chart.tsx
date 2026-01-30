"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
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
    confirmed: number;
    completed: number;
    cancelled: number;
  }[];
  isLoading: boolean;
}

const ServiceChart: React.FC<ServiceChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="w-full shadow-sm border rounded-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Top Performing Services
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
            Top Performing Services
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
          Breakdown of bookings by status for top services
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
              />
              <Legend iconType="circle" />
              <Bar
                dataKey="completed"
                stackId="a"
                fill="#10b981" // Green
                name="Completed"
              />
              <Bar
                dataKey="confirmed"
                stackId="a"
                fill="#3b82f6" // Blue
                name="Confirmed"
              />
              <Bar
                dataKey="cancelled"
                stackId="a"
                fill="#ef4444" // Red
                name="Cancelled"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceChart;
