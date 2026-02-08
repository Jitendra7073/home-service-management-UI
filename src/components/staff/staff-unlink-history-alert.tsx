"use client";

import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { XCircle, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function StaffUnlinkHistoryAlert() {
    const [visibleAlerts, setVisibleAlerts] = useState<string[]>([]);

    const { data } = useQuery({
        queryKey: ["staff-business-history"],
        queryFn: async () => {
            const res = await fetch("/api/v1/staff/history", {
                credentials: "include",
            });
            if (!res.ok) return { history: [] };
            return res.json();
        },
    });

    useEffect(() => {
        if (data?.history && data.history.length > 0) {
            // Filter for recent unlinks (e.g., last 7 days) that haven't been dismissed
            // For now, just show the most recent one if it exists
            const recentUnlinks = data.history.filter((item: any) => {
                const unlinkDate = new Date(item.createdAt);
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                return unlinkDate > sevenDaysAgo;
            });

            if (recentUnlinks.length > 0) {
                // Use IDs to manage visibility
                setVisibleAlerts(recentUnlinks.map((item: any) => item.id));
            }
        }
    }, [data]);

    const dismissAlert = (id: string) => {
        setVisibleAlerts((prev) => prev.filter((alertId) => alertId !== id));
    };

    if (!data?.history || visibleAlerts.length === 0) return null;

    return (
        <div className="space-y-4 mb-6">
            {data.history
                .filter((item: any) => visibleAlerts.includes(item.id))
                .map((item: any) => (
                    <Alert key={item.id} variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertTitle>Removed from Business</AlertTitle>
                        <AlertDescription className="mt-2">
                            <p>
                                You have been removed from{" "}
                                <strong>{item.businessProfile?.businessName || "a business"}</strong>.
                            </p>
                            {item.reason && (
                                <div className="mt-2 p-2 bg-red-50 rounded text-sm text-red-800 border border-red-200">
                                    <span className="font-semibold">Reason:</span> {item.reason}
                                </div>
                            )}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-red-100"
                                onClick={() => dismissAlert(item.id)}>
                                <span className="sr-only">Dismiss</span>
                                &times;
                            </Button>
                        </AlertDescription>
                    </Alert>
                ))}
        </div>
    );
}
