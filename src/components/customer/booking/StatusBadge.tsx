import { Badge } from "@/components/ui/badge";

export function BookingStatusBadge({
  status,
}: {
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
}) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-300",
    CONFIRMED: "bg-green-50 text-green-700 border-green-300",
    CANCELLED: "bg-red-50 text-red-700 border-red-300",
  };

  return (
    <Badge
      className={`border font-medium px-2 py-1 rounded-sm md:rounded-full ${colors[status] || "bg-gray-50 text-gray-700 border-gray-200"
        }`}>
      {status}
    </Badge>
  );
}

export function PaymentStatusBadge({
  status,
}: {
  status: "PENDING" | "PAID" | "REFUNDED" | "FAILED" | "CANCELLED";
}) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    PAID: "bg-green-100 text-green-800 border-green-300",
    REFUNDED: "bg-blue-100 text-blue-800 border-blue-300",
    FAILED: "bg-red-100 text-red-800 border-red-300",
    CANCELLED: "bg-gray-100 text-gray-700 border-gray-300",
  };

  return (
    <Badge
      className={` rounded-sm border font-medium px-4 py-1 ${colors[status] || "bg-gray-50 text-gray-700 border-gray-200"
        }`}>
      {status}
    </Badge>
  );
}
