import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface CardProps {
  title: string;
  value: string;
  growth: string;
  icon?: any;
  linkText: string;
  isLoading?: boolean;
}

const QuickCountCard: React.FC<CardProps> = ({
  title,
  value,
  growth,
  icon: Icon,
  linkText,
  isLoading = true,
}) => {

  if (isLoading) {
    return (
      <Card
        className="
          w-auto
          bg-gradient-to-br from-white via-gray-50 to-gray-100 
          border border-gray-200 shadow-sm rounded-md py-3 space-y-0 transition-all
        ">
        <CardHeader className="flex flex-col gap-2 ">
          <div className="flex items-center justify-between gap-3">
            {/* Icon bubble */}
            <div className="h-7  w-7  rounded-sm bg-gray-200 animate-pulse" />
            <div className="h-6 w-32 bg-gray-200 rounded-sm animate-pulse" />
          </div>
        </CardHeader>
        <CardContent >
          <div className="h-6 w-35 bg-gray-200 rounded-sm animate-pulse" />
          <div className="h-4 w-25 bg-gray-200 rounded-sm animate-pulse mt-2" />
        </CardContent>
        <CardFooter className="flex justify-start gap-2 items-center ">
          <div className="h-5 w-25 bg-gray-200 rounded-sm animate-pulse" />
          <div className="h-5 w-5 bg-gray-200 rounded-sm animate-pulse" />
        </CardFooter>
      </Card>
    )
  }
  return (
    <Card
      className="
        w-auto 
        bg-gradient-to-br from-white via-gray-50 to-gray-100 
        border border-gray-200 shadow-sm rounded-md py-3 space-y-0 transition-all
      ">
      <CardHeader className="flex flex-col gap-2 ">
        <div className="flex items-center justify-between gap-3">
          {/* Icon bubble */}
          {Icon && (
            <div className="p-2 rounded-sm bg-gray-100 text-gray-700 shadow-sm">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <CardTitle className="text-base font-semibold text-gray-900">
            {title}
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent >
        <div className="text-3xl font-bold tracking-tight text-gray-900">
          {value}
        </div>

        <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
          {growth}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between items-center ">
        <button
          className="
            text-sm font-medium text-gray-700 hover:text-blue-700 hover:underline cursor-pointer 
            flex items-center gap-1 transition-all hover:gap-3 
          ">
          {linkText} <ArrowRight className="w-4 h-4" />
        </button>
      </CardFooter>
    </Card>
  );
};

export default QuickCountCard;
