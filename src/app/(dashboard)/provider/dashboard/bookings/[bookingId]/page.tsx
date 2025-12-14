import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

async function getBooking(bookingId: string) {
    const res = await fetch(`/api/provider/bookings`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ bookingId }),
        }
    );

    if (!res.ok) return null;
    return res.json();
}

export default async function BookingDetailsPage({
    params,
}: {
    params: { bookingId: string };
}) {
    console.log("params", params);
    const booking = await getBooking(params.bookingId);
    console.log("booking", booking);

    if (!booking) notFound();

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Booking Details</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <Info label="Booking ID" value={booking.id} />
                <Info
                    label="Created At"
                    value={new Date(booking.createdAt).toLocaleString("en-IN")}
                />
                <Info
                    label="Customer"
                    value={booking.user?.name || "N/A"}
                />
                <Info
                    label="Service"
                    value={booking.service?.name || "N/A"}
                />
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                    <p className="text-xs text-gray-500">Payment Status</p>
                    <Badge>{booking.paymentStatus}</Badge>
                </div>

                <div>
                    <p className="text-xs text-gray-500">Booking Status</p>
                    <Badge>{booking.bookingStatus}</Badge>
                </div>

                <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-lg font-semibold">
                        ₹{Number(booking.totalAmount).toLocaleString("en-IN")}
                    </p>
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <Info label="Service ID" value={booking.serviceId} />
                <Info label="Slot ID" value={booking.slotId} />
                <Info label="Address ID" value={booking.addressId} />
                <Info label="Business Profile ID" value={booking.businessProfileId} />
            </div>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-medium break-all">{value}</p>
        </div>
    );
}
