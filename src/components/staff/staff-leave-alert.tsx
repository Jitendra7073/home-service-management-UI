"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface StaffLeaveAlertProps {
    isOnLeave: boolean;
    leaveDetails?: {
        leaveType: string;
        reason: string;
        startDate: string;
        endDate: string;
    };
}

export function StaffLeaveAlert({ isOnLeave, leaveDetails }: StaffLeaveAlertProps) {
    if (!isOnLeave) return null;

    return (
        <div className="w-full">
            <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div className="ml-2">
                    <AlertTitle className="text-yellow-800 font-semibold mb-1">
                        You are currently on specific leave
                    </AlertTitle>
                    <AlertDescription className="text-yellow-700">
                        <p>
                            You're marked as away from{" "}
                            <strong>
                                {new Date(leaveDetails?.startDate || "").toLocaleDateString()}
                            </strong>{" "}
                            to{" "}
                            <strong>
                                {new Date(leaveDetails?.endDate || "").toLocaleDateString()}
                            </strong>
                            .
                        </p>
                        {leaveDetails?.reason && (
                            <p className="mt-1 text-sm bg-yellow-100/50 p-2 rounded border border-yellow-200 inline-block">
                                Reason: {leaveDetails.reason}
                            </p>
                        )}
                        <p className="mt-2 text-sm text-yellow-600 italic">
                            Note: You won't be assigned new bookings during this period.
                        </p>
                    </AlertDescription>
                </div>
            </Alert>
        </div>
    );
}
