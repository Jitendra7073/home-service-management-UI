"use client";

import { Button } from "@/components/ui/button";
import { Download, PlusCircleIcon } from "lucide-react";

interface BookingHeaderProps {
    title?: string;
    description?: string;
    isVisibleAddServiceButton?: boolean;
    onAddServiceClick?: () => void;
}

export default function BookingHeader({
    title,
    description,
    isVisibleAddServiceButton = false,
    onAddServiceClick,
}: BookingHeaderProps) {
    return (
        <div
            className="
        w-full rounded-xl 
        bg-gray-100
        border-2 border-gray-200 
        p-6 sm:p-8 
        flex flex-col gap-4
      "
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {title}
                    </h1>
                    <p className="text-sm text-gray-500">
                        {description}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                    </Button>

                    {isVisibleAddServiceButton && (
                        <Button
                            size="sm"
                            className="bg-blue-600 text-white hover:bg-blue-500"
                            onClick={onAddServiceClick}
                        >
                            <PlusCircleIcon className="w-4 h-4 mr-1" />
                            Add New Service
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
