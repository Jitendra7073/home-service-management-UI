import { Badge } from "@/components/ui/badge";
import {
  BOOKING_STATUS_CONFIG,
  PAYMENT_STATUS_CONFIG,
  BookingStatus,
  PaymentStatus,
} from "@/types/booking.types";

export function BookingStatusBadge({
  status,
  size = "md",
}: {
  status: string;
  size?: "sm" | "md" | "lg";
}) {
  const upperStatus = status.toUpperCase() as BookingStatus;
  const config = BOOKING_STATUS_CONFIG[upperStatus] || {
    label: status,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    description: "Unknown status",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  return (
    <Badge
      className={`border font-medium rounded-full ${config.bgColor} ${config.color} ${config.borderColor} ${sizeClasses[size]}`}
      title={config.description}>
      {config.label}
    </Badge>
  );
}

export function PaymentStatusBadge({
  status,
  size = "md",
}: {
  status: string;
  size?: "sm" | "md" | "lg";
}) {
  const upperStatus = status.toUpperCase() as PaymentStatus;
  const config = PAYMENT_STATUS_CONFIG[upperStatus] || {
    label: status,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    description: "Unknown status",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs rounded-sm",
    md: "px-4 py-1 text-sm rounded-sm",
    lg: "px-5 py-1.5 text-base rounded-md",
  };

  return (
    <Badge
      className={`border font-medium ${config.bgColor} ${config.color} ${config.borderColor} ${sizeClasses[size]}`}
      title={config.description}>
      {config.label}
    </Badge>
  );
}
