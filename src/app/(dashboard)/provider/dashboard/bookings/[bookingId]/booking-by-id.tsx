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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* ---------------- TYPES ---------------- */

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED";

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
  slot: {
    time: string;
  };
  date: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  totalAmount?: number;
  cancellation?: {
    refundAmount: number;
    refundStatus: string;
    reason?: string;
  };
}

/* ---------------- STATUS STYLES ---------------- */

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

/* ---------------- COMPONENT ---------------- */

export default function BookingDetailsDashboard({
  bookingId,
}: {
  bookingId: string;
}) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["booking-details", bookingId],
    enabled: Boolean(bookingId),
    queryFn: async () => {
      const res = await fetch(`/api/provider/bookings/${bookingId}`);
      if (!res.ok) throw new Error("Failed to fetch booking");
      return res.json();
    },
  });

  const booking: BookingData | null = data?.bookings ?? null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No booking data found</p>
      </div>
    );
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
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
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Booking Details
            </h1>

            <Badge
              className={`${bookingStatusClasses[booking.bookingStatus]} px-2 py-1`}
            >
              {booking.bookingStatus}
            </Badge>

            <Badge
              className={`${paymentStatusClasses[booking.paymentStatus]} px-2 py-1`}
            >
              {booking.paymentStatus}
            </Badge>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-4">
            {/* CUSTOMER */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <InfoBox icon={User} label="Full Name" value={booking.user.name} />
                  <InfoBox icon={Phone} label="Mobile" value={booking.user.mobile} />
                </div>

                <InfoBox icon={Mail} label="Email" value={booking.user.email} />
              </CardContent>
            </Card>

            {/* SERVICE */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Service Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {booking.service.coverImage && (
                  <img
                    src={booking.service.coverImage}
                    alt={booking.service.name}
                    className="w-full h-64 object-cover rounded-md"
                  />
                )}

                <h3 className="text-xl font-semibold">
                  {booking.service.name}
                </h3>

                <div className="flex gap-3">
                  <Tag
                    icon={Clock}
                    text={`${hours ? `${hours}H ` : ""}${minutes}M`}
                  />
                  <Tag
                    icon={Banknote}
                    text={`${booking.service.currency} ${booking.service.price.toLocaleString()}`}
                  />
                </div>

                <p className="text-gray-600 text-sm">
                  {booking.service.description}
                </p>
              </CardContent>
            </Card>
          </div>

        </div>
            
          {/* RIGHT */}
          <div className="space-y-4">
             {/* INVOICE SUMMARY */}
             <Card className="px-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-blue-600" />
                  Invoice Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-3">
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Price</span>
                    <span className="font-medium">₹{booking.service.price.toLocaleString()}</span>
                 </div>
                 {/* Assuming totalAmount might differ from price due to quantity or taxes */}
                 <Separator />
                 <div className="flex justify-between text-base font-bold">
                    <span>Total Amount</span>
                    <span>₹{booking.totalAmount?.toLocaleString() ?? booking.service.price.toLocaleString()}</span>
                 </div>
              </CardContent>
            </Card>

            {/* REFUND INFO (If Cancelled) */}
            {booking.cancellation && (
               <Card className="px-6 border-red-200 bg-red-50">
                  <CardHeader className="p-0">
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <Banknote className="w-5 h-5" />
                      Refund Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-red-800">Refund Amount</span>
                        <span className="font-bold text-red-900">₹{booking.cancellation.refundAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-red-800">Status</span>
                        <span className="capitalize text-red-900">{booking.cancellation.refundStatus}</span>
                      </div>
                      {booking.cancellation.reason && (
                         <div className="pt-2">
                            <p className="text-xs text-red-600 font-semibold">Reason:</p>
                            <p className="text-red-800 italic">{booking.cancellation.reason}</p>
                         </div>
                      )}
                  </CardContent>
               </Card>
            )}

            {/* SLOT */}
            <Card className="px-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Appointment Slot
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-blue-50 rounded-md">
                <p className="font-semibold">{booking.slot.time}</p>
                <p>{formatDate(booking.date)}</p>
              </CardContent>
            </Card>

            {/* ADDRESS */}
            <Card className="px-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 p-0">
                <p className="font-semibold text-gray-900">
                  {booking.address.street}
                </p>
                <p>
                  {booking.address.city}, {booking.address.state}{" "}
                  {booking.address.postalCode}
                </p>
                <p>{booking.address.country}</p>
                {booking.address.landmark && (
                  <p className="text-xs mt-2">
                    Landmark: {booking.address.landmark}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* META */}
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="pt-6 space-y-3 text-xs">
                <MetaRow label="Service ID" value={booking.service.id} />
                <Separator />
                <MetaRow label="Booking Created" value={formatDate(booking.createdAt)} />
                <MetaRow label="Last Updated" value={formatDate(booking.updatedAt)} />
                <Separator />
                <MetaRow label="Service Created" value={formatDate(booking.service.createdAt)} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

function InfoBox({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 p-3 bg-gray-50 border rounded-md">
      <Icon className="w-5 h-5 text-gray-600" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function Tag({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <span className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded-full">
      <Icon className="w-4 h-4 text-gray-600" />
      {text}
    </span>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-700">{value}</span>
    </div>
  );
}
