"use client";

import { AlertTriangle, CheckCircle, Clock, Info } from "lucide-react";

interface CancellationStatusAlertProps {
    cancellation: {
        reason: string;
        refundAmount: number;
        refundStatus: string;
        refundedAt?: string | null;
    };
    totalAmount: number;
    compact?: boolean;
}

export default function CancellationStatusAlert({
    cancellation,
    totalAmount,
    compact = false,
}: CancellationStatusAlertProps) {
    const cancellationFee = totalAmount - cancellation.refundAmount;

    const getStatusConfig = () => {
        switch (cancellation.refundStatus) {
            case "PAID":
                return {
                    icon: CheckCircle,
                    color: "text-green-700",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    message: "Refund completed successfully",
                };
            case "PROCESSING":
                return {
                    icon: Clock,
                    color: "text-blue-700",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                    message: "Refund is being processed",
                };
            case "FAILED":
                return {
                    icon: AlertTriangle,
                    color: "text-red-700",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    message: "Refund failed - Contact support",
                };
            default: // PENDING
                return {
                    icon: Clock,
                    color: "text-yellow-700",
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200",
                    message: "Refund initiated",
                };
        }
    };

    const statusConfig = getStatusConfig();
    const Icon = statusConfig.icon;

    if (compact) {
        return (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
                <Icon className={`w-4 h-4 ${statusConfig.color}`} />
                <div className="flex-1">
                    <p className={`text-xs font-semibold ${statusConfig.color}`}>
                        Booking Cancelled
                    </p>
                    <p className="text-[10px] text-gray-600">
                        {cancellation.refundAmount > 0
                            ? `₹${cancellation.refundAmount} refund - ${statusConfig.message}`
                            : "No refund applicable"
                        }
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-3 rounded-lg ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
            <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${statusConfig.color} mt-0.5 flex-shrink-0`} />
                <div className="flex-1">
                    <h4 className={`text-sm font-bold ${statusConfig.color} mb-1`}>
                        Booking Cancelled
                    </h4>

                    {cancellation.refundAmount > 0 ? (
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-600">Original Amount:</span>
                                <span className="font-medium">₹{totalAmount}</span>
                            </div>

                            {cancellationFee > 0 && (
                                <div className="flex justify-between text-xs text-red-600">
                                    <span>Cancellation Fee:</span>
                                    <span className="font-medium">- ₹{cancellationFee}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-xs text-green-700 font-semibold border-t pt-1">
                                <span>Refund Amount:</span>
                                <span>₹{cancellation.refundAmount}</span>
                            </div>

                            <div className={`flex items-start gap-1.5 text-[10px] ${statusConfig.color} mt-2`}>
                                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                <span>
                                    {cancellation.refundStatus === "PAID"
                                        ? `Refunded on ${new Date(cancellation.refundedAt!).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                                        : cancellation.refundStatus === "PROCESSING"
                                            ? "Processing - 5-7 business days"
                                            : cancellation.refundStatus === "FAILED"
                                                ? "Failed - Contact support"
                                                : "Initiated - Processing soon"
                                    }
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-600">
                            No refund applicable for this booking
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
