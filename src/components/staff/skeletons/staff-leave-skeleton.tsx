import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StaffLeaveSkeleton() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Leave Requests List Skeleton */}
            <div className="space-y-5">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="border border-gray-200">
                        <CardContent className="px-4 py-2">
                            <div className="flex items-start justify-between">
                                <div className="flex-1 space-y-3">
                                    {/* Status & Type Badges */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-6 w-20 bg-gray-200 rounded " />
                                        <div className="h-6 w-24 bg-gray-200 rounded " />
                                        <div className="h-4 w-40 bg-gray-200 rounded " />
                                    </div>

                                    {/* Date Range */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-200 rounded " />
                                            <div className="h-4 w-50 bg-gray-200 rounded " />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-200 rounded " />
                                            <div className="h-4 w-50 bg-gray-200 rounded " />
                                        </div>
                                    </div>

                                    {/* Reason Skeleton */}
                                    <div className="h-10 w-full bg-gray-100 rounded  border border-gray-200" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
