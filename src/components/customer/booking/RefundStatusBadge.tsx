"use client";

import { Badge } from "@/components/ui/badge";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
    Banknote,
} from "lucide-react";

interface RefundStatusBadgeProps {
    refundStatus: string;
    refundAmount?: number;
    cancellationFee?: number;
    originalAmount?: number;
    refundedAt?: string | null;
}

const REFUND_STATUS_CONFIG: Record<
    string,
    {
        label: string;
        icon: any;
        color: string;
        bgColor: string;
        description: string;
        step: number;
    }
> = {
    PENDING: {
        label: "Refund Pending",
        icon: Clock,
        color: "text-yellow-700",
        bgColor: "bg-yellow-100 hover:bg-yellow-200",
        description:
            "Your refund request has been received and is awaiting processing.",
        step: 1,
    },
    PROCESSING: {
        label: "Processing Refund",
        icon: Clock,
        color: "text-blue-700",
        bgColor: "bg-blue-100 hover:bg-blue-200",
        description:
            "Your refund is currently being processed. It typically takes 5-7 business days to reflect in your account.",
        step: 2,
    },
    PAID: {
        label: "Refunded",
        icon: CheckCircle2,
        color: "text-green-700",
        bgColor: "bg-green-100 hover:bg-green-200",
        description: "Refund has been successfully processed to your original payment method.",
        step: 3,
    },
    REFUNDED: {
        label: "Refunded",
        icon: CheckCircle2,
        color: "text-green-700",
        bgColor: "bg-green-100 hover:bg-green-200",
        description: "Refund has been successfully processed to your original payment method.",
        step: 3,
    },
    FAILED: {
        label: "Refund Failed",
        icon: XCircle,
        color: "text-red-700",
        bgColor: "bg-red-100 hover:bg-red-200",
        description:
            "Refund processing failed. Please contact support for assistance.",
        step: -1,
    },
    CANCELLED: {
        label: "No Refund",
        icon: AlertCircle,
        color: "text-gray-700",
        bgColor: "bg-gray-100 hover:bg-gray-200",
        description: "Booking was cancelled before payment.",
        step: 0,
    },
};

export default function RefundStatusBadge({
    refundStatus,
    refundAmount,
    cancellationFee,
    originalAmount,
    refundedAt,
}: RefundStatusBadgeProps) {
    const config = REFUND_STATUS_CONFIG[refundStatus] || REFUND_STATUS_CONFIG.PENDING;
    const Icon = config.icon;

    // Refund progression steps
    const steps = [
        { label: "Pending", status: "PENDING", step: 1 },
        { label: "Processing", status: "PROCESSING", step: 2 },
        { label: "Completed", status: "PAID", step: 3 },
    ];

    const currentStep = config.step;
    const isFailed = refundStatus === "FAILED";

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <Badge
                    variant="outline"
                    className={`${config.bgColor} ${config.color} border-0 cursor-pointer flex items-center gap-1.5 px-3 py-1`}
                >
                    <Icon className="w-3.5 h-3.5" />
                    {config.label}
                </Badge>
            </HoverCardTrigger>

            <HoverCardContent className="w-80" align="start">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Banknote className={`w-5 h-5 ${config.color}`} />
                        <h4 className="font-semibold text-sm">Refund Details</h4>
                    </div>

                    <p className="text-xs text-gray-600">{config.description}</p>

                    {/* Progress Tracker - Only show if not CANCELLED or FAILED */}
                    {!isFailed && refundStatus !== "CANCELLED" && (
                        <div className="border-t pt-3">
                            <p className="text-xs font-semibold text-gray-700 mb-3">Refund Progress</p>
                            <div className="relative">
                                {/* Progress Line */}
                                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
                                    <div
                                        className={`h-full transition-all duration-500 ${currentStep >= 3
                                            ? "bg-green-500 w-full"
                                            : currentStep >= 2
                                                ? "bg-blue-500 w-1/2"
                                                : "bg-yellow-500 w-0"
                                            }`}
                                    />
                                </div>

                                {/* Steps */}
                                <div className="relative flex justify-between">
                                    {steps.map((s, idx) => {
                                        // Treat step as done when currentStep meets or exceeds it (covers PAID/REFUNDED)
                                        const isCompleted = currentStep > s.step;
                                        const isCurrent = currentStep === s.step;
                                        const isDone = currentStep >= s.step;

                                        return (
                                            <div key={s.status} className="flex flex-col items-center">
                                                <div
                                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isDone
                                                        ? "bg-green-500 border-green-500 text-white"
                                                        : isCurrent
                                                            ? refundStatus === "PROCESSING"
                                                                ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                                                                : "bg-yellow-500 border-yellow-500 text-white"
                                                            : "bg-white border-gray-300 text-gray-400"
                                                        }`}
                                                >
                                                    {isDone ? (
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    ) : (
                                                        <span className="text-xs font-semibold">{s.step}</span>
                                                    )}
                                                </div>
                                                <span
                                                    className={`text-[10px] mt-2 font-medium ${isDone || isCurrent
                                                        ? "text-gray-900"
                                                        : "text-gray-400"
                                                        }`}
                                                >
                                                    {s.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {refundAmount !== undefined && originalAmount && (
                        <div className="space-y-1.5 text-sm border-t pt-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Original Amount</span>
                                <span className="font-medium">₹{originalAmount}</span>
                            </div>

                            {cancellationFee !== undefined && cancellationFee > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Cancellation Fee</span>
                                    <span className="font-medium">- ₹{cancellationFee}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-green-700 font-semibold border-t pt-1.5">
                                <span>Refund Amount</span>
                                <span>₹{refundAmount}</span>
                            </div>
                        </div>
                    )}

                    {refundedAt && (
                        <p className="text-xs text-gray-500 border-t pt-2">
                            <CheckCircle2 className="w-3 h-3 inline mr-1 text-green-600" />
                            Processed on:{" "}
                            {new Date(refundedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    )}

                    {refundStatus === "PENDING" && (
                        <div className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded border border-yellow-200">
                            ⏳ Your refund has been initiated and is awaiting processing
                        </div>
                    )}

                    {refundStatus === "PROCESSING" && (
                        <div className="text-xs text-blue-700 bg-blue-50 p-2 rounded border border-blue-200">
                            🔄 Refund is being processed. Typically takes 5-7 business days
                        </div>
                    )}

                    {refundStatus === "FAILED" && (
                        <div className="text-xs text-red-700 bg-red-50 p-2 rounded border border-red-200">
                            ❌ Please contact support at support@homeservice.com or call 1800-XXX-XXXX
                        </div>
                    )}
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}
