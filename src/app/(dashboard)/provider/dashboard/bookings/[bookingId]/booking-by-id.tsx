"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Banknote,
  Calendar,
  Package,
  Loader2,
  Activity,
  CheckCircle2,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* ---------------- TYPES ---------------- */

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "CANCELLED";

type TrackingStatus =
  | "NOT_STARTED"
  | "BOOKING_STARTED"
  | "PROVIDER_ON_THE_WAY"
  | "SERVICE_STARTED"
  | "COMPLETED";

interface BookingData {
  user: {
    name: string;
    email: string;
    mobile: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    landmark?: string;
  };
  service: {
    id: string;
    name: string;
    description: string;
    durationInMinutes: number;
    price: number;
    currency: string;
    coverImage?: string;
    createdAt: string;
  };
  slot: { time: string };
  date: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  trackingStatus?: TrackingStatus;
  createdAt: string;
  updatedAt: string;
  totalAmount?: number;
  cancellation?: {
    refundAmount: number;
    refundStatus: string;
    reason?: string;
  };
}

/* ---------------- STATUS COLORS ---------------- */

const bookingStatusClasses: Record<BookingStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const paymentStatusClasses: Record<PaymentStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

/* ---------------- TRACKING STEPS ---------------- */

const TRACKING_STEPS: TrackingStatus[] = [
  "NOT_STARTED",
  "BOOKING_STARTED",
  "PROVIDER_ON_THE_WAY",
  "SERVICE_STARTED",
  "COMPLETED",
];

const STEP_COLORS: Record<TrackingStatus, string> = {
  NOT_STARTED: "bg-gray-500",
  BOOKING_STARTED: "bg-blue-500",
  PROVIDER_ON_THE_WAY: "bg-indigo-500",
  SERVICE_STARTED: "bg-purple-500",
  COMPLETED: "bg-green-600",
};

/* ---------------- MAIN COMPONENT ---------------- */

export default function BookingDetailsDashboard({
  bookingId,
}: {
  bookingId: string;
}) {
  const router = useRouter();

  const { data, isLoading, isFetching, isError, refetch } = useQuery({
    queryKey: ["booking-details", bookingId],
    enabled: Boolean(bookingId),
    queryFn: async () => {
      const res = await fetch(`/api/provider/bookings/${bookingId}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to fetch booking");
      return res.json();
    },
    refetchInterval: 5000, // every 5s
    refetchIntervalInBackground: true, // even in bg tab
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  const booking: BookingData | null = data?.bookings ?? null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3">
        <p className="text-gray-500">No booking data found</p>
        <Button variant="outline" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const hours = Math.floor(booking.service.durationInMinutes / 60);
  const minutes = booking.service.durationInMinutes % 60;

  return (
    <div className="flex w-full justify-center min-h-screen">
      <div className="w-full max-w-[1400px] px-4 py-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">Booking Details</h1>

            {/* Cancellation alert in header */}
            {booking.bookingStatus === "CANCELLED" ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 border border-red-300 rounded-sm">
                <XCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-red-800">
                  Cancelled by Customer
                </span>
              </div>
            ) : (
              <Badge className={bookingStatusClasses[booking.bookingStatus]}>
                {booking.bookingStatus}
              </Badge>
            )}

            <Badge className={paymentStatusClasses[booking.paymentStatus]}>
              {booking.paymentStatus}
            </Badge>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-4">
            {/* CUSTOMER */}
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <User className="w-5 h-5 text-blue-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoBox
                  icon={User}
                  label="Full Name"
                  value={booking.user.name}
                />
                <InfoBox
                  icon={Phone}
                  label="Mobile"
                  value={booking.user.mobile}
                />
                <InfoBox icon={Mail} label="Email" value={booking.user.email} />
              </CardContent>
            </Card>

            {/* SERVICE */}
            <Card>
              <CardHeader>
                <CardTitle className="flex gap-2 items-center">
                  <Package className="w-5 h-5 text-blue-600" />
                  Service Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {booking.service.coverImage && (
                  <img
                    src={booking.service.coverImage}
                    alt={booking.service.name}
                    className="w-full h-64 object-cover rounded-sm"
                  />
                )}

                <h3 className="text-xl font-semibold">
                  {booking.service.name}
                </h3>

                <div className="flex gap-3">
                  <Tag icon={Clock} text={`${hours}H ${minutes}M`} />
                  <Tag icon={Banknote} text={`₹ ${booking.service.price}`} />
                </div>

                <p className="text-gray-600 text-sm">
                  {booking.service.description}
                </p>
              </CardContent>
            </Card>

            {/* INVOICE */}
            <Card className="px-6">
              <CardHeader className="p-0">
                <CardTitle className="flex gap-2 items-center">
                  <Banknote className="w-5 h-5 text-blue-600" />
                  Invoice Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Service Price</span>
                  <span>₹{booking.service.price}</span>
                </div>

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total Amount</span>
                  <span>₹{booking.totalAmount ?? booking.service.price}</span>
                </div>
              </CardContent>
            </Card>

            {/* REFUND */}
            {booking.cancellation && (
              <Card className="border-red-200 bg-red-50 px-6">
                <CardHeader className="p-0">
                  <CardTitle className="text-red-700">Refund Details</CardTitle>
                </CardHeader>

                <CardContent className="p-0 text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Refund Amount</span>
                    <span>₹{booking.cancellation.refundAmount}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>{booking.cancellation.refundStatus}</span>
                  </div>

                  {booking.cancellation.reason && (
                    <p className="italic text-red-700">
                      {booking.cancellation.reason}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-4">
            {/* TRACKING PROGRESS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between gap-2 items-center">
                  <div className="flex gap-2 items-center">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Tracking Progress
                  </div>
                  {isFetching && (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrackingProgress
                  current={booking.trackingStatus || "NOT_STARTED"}
                  bookingStatus={booking.bookingStatus}
                />
              </CardContent>
            </Card>

            {/* SLOT */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Slot</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{booking.slot.time}</p>
                <p>{formatDate(booking.date)}</p>
              </CardContent>
            </Card>

            {/* ADDRESS */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{booking.address.street}</p>
                <p>
                  {booking.address.city}, {booking.address.state}
                </p>
                <p>{booking.address.country}</p>
              </CardContent>
            </Card>

            {/* META */}
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="pt-6 space-y-2 text-xs">
                <MetaRow label="Service ID" value={booking.service.id} />
                <MetaRow
                  label="Created"
                  value={formatDate(booking.createdAt)}
                />
                <MetaRow
                  label="Updated"
                  value={formatDate(booking.updatedAt)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- TRACKING PROGRESS COMPONENT ---------------- */

function TrackingProgress({
  current,
  bookingStatus,
}: {
  current: TrackingStatus;
  bookingStatus: BookingStatus;
}) {
  const currentIndex = TRACKING_STEPS.indexOf(current);
  const isCancelled = bookingStatus === "CANCELLED";

  return (
    <div className="space-y-4">
      {/* Cancellation message - show when cancelled */}
      {isCancelled && (
        <div className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-sm mb-4">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm font-medium text-red-800 text-center">
            Service was cancelled by customer at{" "}
            <span className="font-bold">
              {current === "NOT_STARTED"
                ? "the beginning"
                : current.charAt(0).toUpperCase() +
                current
                  .toLocaleLowerCase()
                  .slice(1)
                  .replaceAll("_", " ")
                  .toLowerCase()}
            </span>{" "}
            stage
          </p>
        </div>
      )}

      {/* Tracking timeline */}
      <div className="relative">
        {TRACKING_STEPS.map((step, i) => {
          const done = i <= currentIndex;

          // For cancelled bookings, use red color instead of step colors
          const displayColor = isCancelled ? "bg-red-500" : STEP_COLORS[step];

          return (
            <div key={step} className="flex gap-3 pb-6 relative">
              {i !== TRACKING_STEPS.length - 1 && (
                <div
                  className={`absolute left-3 top-7 w-1 h-full rounded ${i < currentIndex ? displayColor : "bg-gray-200"
                    }`}
                />
              )}

              {/* Step circle - show X icon for cancelled state beyond current step */}
              <div
                className={`w-7 h-7 rounded-sm flex items-center justify-center text-white shadow ${done ? displayColor : "bg-gray-300"
                  }`}>
                {done ? (
                  isCancelled ? (
                    <X size={16} strokeWidth={3} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )
                ) : (
                  i + 1
                )}
              </div>

              <div>
                <p
                  className={`${done
                    ? isCancelled
                      ? "font-semibold text-red-700"
                      : "font-semibold"
                    : "text-gray-500"
                    }`}>
                  {step.replaceAll("_", " ")}
                </p>
              </div>
            </div>
          );
        })}

        {/* Cancelled indicator at the end */}
        {isCancelled && (
          <div className="flex gap-3 relative">
            <div className="absolute left-3 top-7 w-1 h-6 rounded bg-gray-200" />
            <div className="w-7 h-7 rounded-sm flex items-center justify-center text-white shadow bg-red-600 border-2 border-red-600">
              <X size={16} strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-red-700">Cancelled</p>
              <p className="text-xs text-gray-500">By Customer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function InfoBox({ icon: Icon, label, value }: any) {
  return (
    <div className="flex gap-3 p-3 border rounded-sm">
      <Icon className="w-5 h-5 text-gray-600" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function Tag({ icon: Icon, text }: any) {
  return (
    <span className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-sm text-sm">
      <Icon className="w-4 h-4" />
      {text}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span>{value}</span>
    </div>
  );
}
