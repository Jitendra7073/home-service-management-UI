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

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

interface ChartProps {
  title: string;
  description: string;
  // data: any[];
}

const chartConfig = {
  desktop: {
    label: "Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const ChartLineLinear:React.FC<ChartProps> = ({title,description}) => {

  return (
    <Card className="w-full shadow-sm border rounded-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
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
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              fill="var(--color-desktop)"
              fillOpacity={0.1}
            />

            {/* Main line */}
            <Line
              dataKey="desktop"
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

export default ChartLineLinear;
