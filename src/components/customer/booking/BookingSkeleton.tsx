import React from "react";

export default function BookingSkeleton() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">

                    {/* Left side skeleton (title + subtitle) */}
                    <div className="flex-1 space-y-2">
                        <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>

                    {/* Status badge skeleton */}
                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse ml-4" />
                </div>
            </div>
        </div>
    );
}
