/**
 * Booking Status Enum
 * Matches the database schema in Prisma
 */
export enum BookingStatus {
  PENDING = "PENDING",
  PENDING_PAYMENT = "PENDING_PAYMENT",
  CANCEL_REQUESTED = "CANCEL_REQUESTED",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

/**
 * Payment Status Enum
 * Matches the database schema in Prisma
 */
export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}

/**
 * Booking Status Display Configuration
 * Contains labels, colors, and icons for each status
 */
export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
    canTransitionTo: BookingStatus[];
  }
> = {
  [BookingStatus.PENDING]: {
    label: "Pending",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    description: "Booking is awaiting confirmation",
    canTransitionTo: [
      BookingStatus.CONFIRMED,
      BookingStatus.CANCEL_REQUESTED,
      BookingStatus.CANCELLED,
    ],
  },
  [BookingStatus.PENDING_PAYMENT]: {
    label: "Pending Payment",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    description: "Awaiting payment confirmation",
    canTransitionTo: [
      BookingStatus.CONFIRMED,
      BookingStatus.CANCELLED,
    ],
  },
  [BookingStatus.CANCEL_REQUESTED]: {
    label: "Cancel Requested",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-300",
    description: "Customer requested cancellation",
    canTransitionTo: [
      BookingStatus.CANCELLED,
      BookingStatus.CONFIRMED,
    ],
  },
  [BookingStatus.CONFIRMED]: {
    label: "Confirmed",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    description: "Booking is confirmed",
    canTransitionTo: [
      BookingStatus.COMPLETED,
      BookingStatus.CANCEL_REQUESTED,
      BookingStatus.CANCELLED,
    ],
  },
  [BookingStatus.COMPLETED]: {
    label: "Completed",
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    description: "Service has been completed",
    canTransitionTo: [],
  },
  [BookingStatus.CANCELLED]: {
    label: "Cancelled",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    description: "Booking has been cancelled",
    canTransitionTo: [],
  },
};

/**
 * Payment Status Display Configuration
 */
export const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
  }
> = {
  [PaymentStatus.PENDING]: {
    label: "Pending",
    color: "text-yellow-800",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-300",
    description: "Payment is pending",
  },
  [PaymentStatus.PAID]: {
    label: "Paid",
    color: "text-green-800",
    bgColor: "bg-green-100",
    borderColor: "border-green-300",
    description: "Payment completed",
  },
  [PaymentStatus.REFUNDED]: {
    label: "Refunded",
    color: "text-blue-800",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-300",
    description: "Payment has been refunded",
  },
  [PaymentStatus.FAILED]: {
    label: "Failed",
    color: "text-red-800",
    bgColor: "bg-red-100",
    borderColor: "border-red-300",
    description: "Payment failed",
  },
  [PaymentStatus.CANCELLED]: {
    label: "Cancelled",
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-300",
    description: "Payment cancelled",
  },
};

/**
 * Helper function to validate status transitions
 */
export function canTransitionTo(
  currentStatus: BookingStatus,
  nextStatus: BookingStatus
): boolean {
  const config = BOOKING_STATUS_CONFIG[currentStatus];
  return config.canTransitionTo.includes(nextStatus);
}

/**
 * Helper function to get allowed status transitions
 */
export function getAllowedTransitions(
  currentStatus: BookingStatus
): BookingStatus[] {
  return BOOKING_STATUS_CONFIG[currentStatus].canTransitionTo;
}

/**
 * Convert database status to frontend display format
 */
export function formatBookingStatus(status: string): string {
  const upperStatus = status.toUpperCase() as BookingStatus;
  if (upperStatus in BOOKING_STATUS_CONFIG) {
    return BOOKING_STATUS_CONFIG[upperStatus].label;
  }
  return status;
}

/**
 * Convert payment status to frontend display format
 */
export function formatPaymentStatus(status: string): string {
  const upperStatus = status.toUpperCase() as PaymentStatus;
  if (upperStatus in PAYMENT_STATUS_CONFIG) {
    return PAYMENT_STATUS_CONFIG[upperStatus].label;
  }
  return status;
}
