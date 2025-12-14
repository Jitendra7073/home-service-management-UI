"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Layers, CheckCircle, XCircle } from "lucide-react";

interface ServiceStatsCardsProps {
    total: number;
    active: number;
    inactive: number;
    isLoading?: boolean;
}

export default function ServiceStatsCards({
    total,
    active,
    inactive,
    isLoading = false,
}: ServiceStatsCardsProps) {
    const stats = [
        {
            label: "Total Services",
            value: total,
            icon: Layers,
            bg: "bg-gray-100",
            text: "text-gray-900",
        },
        {
            label: "Active Services",
            value: active,
            icon: CheckCircle,
            bg: "bg-green-50",
            text: "text-green-700",
        },
        {
            label: "Inactive Services",
            value: inactive,
            icon: XCircle,
            bg: "bg-red-50",
            text: "text-red-700",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((item) => {
                const Icon = item.icon;

                return (
                    <Card key={item.label} className="border shadow-sm">
                        <CardContent className="flex items-center justify-between p-5">
                            {/* Text */}
                            <div className="space-y-1">
                                <p className="text-sm text-gray-500">
                                    {item.label}
                                </p>

                                {isLoading ? (
                                    <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                                ) : (
                                    <p className={`text-2xl font-semibold ${item.text}`}>
                                        {item.value}
                                    </p>
                                )}
                            </div>

                            {/* Icon */}
                            <div
                                className={`p-3 rounded-full ${item.bg}`}
                            >
                                <Icon className={`w-5 h-5 ${item.text}`} />
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
