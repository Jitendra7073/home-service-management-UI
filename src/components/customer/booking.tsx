"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import ExploreHeader from "./explore/exploreHeroSection";
import { useQueryClient } from "@tanstack/react-query";

// Large Components
import FiltersPanel from "@/components/customer/booking/FiltersPanel";
import BookingList from "@/components/customer/booking/BookingList";
import CancelBookingDialog from "@/components/customer/booking/CancelBookingDialog";
import { toast } from "sonner";

export default function CustomerBookingsPage() {

    const queryClient = useQueryClient();

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("date-desc");

    // UI States
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Cancel dialog
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    // Fetch bookings
    const { data, isLoading, isError } = useQuery({
        queryKey: ["customer-bookings"],
        queryFn: async () => {
            const res = await fetch("/api/customer/booking", { cache: "no-store" });

            if (!res.ok) throw new Error("Failed to fetch bookings");

            const result = await res.json();
            return result?.bookings || [];
        },
    });

    const bookings = data?.bookings || [];

    // Filtering & Sorting Logic
    const filteredBookings = useMemo(() => {
        if (!bookings) return [];

        let filtered = bookings.filter((booking: any) => {
            const matchesSearch =
                booking.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.slot.businessProfile.businessName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                booking.status.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });

        // Sorting
        filtered.sort((a: any, b: any) => {
            switch (sortBy) {
                case "date-desc":
                    return (
                        new Date(b.slot.date).getTime() - new Date(a.slot.date).getTime()
                    );
                case "date-asc":
                    return (
                        new Date(a.slot.date).getTime() - new Date(b.slot.date).getTime()
                    );
                case "price-high":
                    return b.service.price - a.service.price;
                case "price-low":
                    return a.service.price - b.service.price;
                default:
                    return 0;
            }
        });

        return filtered;
    }, [bookings, searchQuery, statusFilter, sortBy]);

    // Format helpers
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });

    const formatTime = (time: string) => {
        const [h, m] = time.split(":");
        const hour = parseInt(h);
        const ampm = hour >= 12 ? "PM" : "AM";
        return `${hour % 12 || 12}:${m} ${ampm}`;
    };

    const formatDateTime = (date: string) =>
        new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    // Cancel booking functions
    const handleCancelClick = (booking: any) => {
        setSelectedBooking(booking);
        setCancelDialogOpen(true);
    };

    const handleCancelConfirm = async () => {
        if (!selectedBooking) return;
        if (selectedBooking.status.toLowerCase() !== "pending") {
            toast.warning("You can only cancel pending bookings. This booking already confirmed.");
            return;
        }

        try {
            const res = await fetch("/api/customer/booking/cancel", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    bookingId: selectedBooking.id
                }),
            });

            const data = await res.json();
            // console.log("data:", data);

            console.log("Cancel response:", data);

            if (!res.ok) {
                toast.error(data.error || "Cancellation failed");
                return;
            }

            toast.success("Booking cancelled successfully");
            queryClient.invalidateQueries(["customer-bookings"]);

            setCancelDialogOpen(false);
            setSelectedBooking(null);

        } catch (err) {
            console.error("Error cancelling booking:", err);
            toast.error("Something went wrong while cancelling");
        }
    };


    // Invoice download
    const handleDownloadInvoice = (booking: any) => {
        console.log("Download invoice:", booking.id);
    };

    // Calling provider
    const handleCall = (phone: string) => {
        window.location.href = `tel:${phone}`;
    };

    // Copy handler
    const handleCopy = async (id: string, value: string) => {
        await navigator.clipboard.writeText(value);
        setCopiedField(id);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Reset filters
    const resetFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setSortBy("date-desc");
    };

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600">
                Failed to load bookings.
            </div>
        );
    }

    return (
        <>
            {/* Page Header */}
            <ExploreHeader
                isVisible={false}
                heading="All Bookings"
                description="Your past and upcoming service booking history."
                icons={<Calendar className="w-8 h-8 text-gray-300" />}
            />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-5 sm:py-10">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="flex sm:hidden mb-4">
                            <FiltersPanel
                                mobileFiltersOpen={mobileFiltersOpen}
                                setMobileFiltersOpen={setMobileFiltersOpen}
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                resetFilters={resetFilters}
                                data={bookings}
                                filteredBookings={filteredBookings}
                            />
                        </div>

                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Search booking by name or provider..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 border-gray-300 text-base w-full"
                            />
                        </div>
                    </div>

                    <div className="flex gap-6">
                        {/* Sidebar */}
                        <FiltersPanel
                            mobileFiltersOpen={mobileFiltersOpen}
                            setMobileFiltersOpen={setMobileFiltersOpen}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            resetFilters={resetFilters}
                            data={bookings}
                            filteredBookings={filteredBookings}
                        />

                        {/* BOOKING LIST */}
                        <div className="flex-1">
                            <BookingList
                                isLoading={isLoading}
                                filteredBookings={filteredBookings}
                                searchQuery={searchQuery}
                                handleCopy={handleCopy}
                                copiedField={copiedField}
                                formatDate={formatDate}
                                formatTime={formatTime}
                                formatDateTime={formatDateTime}
                                handleCancelClick={handleCancelClick}
                                handleDownloadInvoice={handleDownloadInvoice}
                                handleCall={handleCall}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Booking Dialog */}
            <CancelBookingDialog
                open={cancelDialogOpen}
                setOpen={setCancelDialogOpen}
                selectedBooking={selectedBooking}
                handleCancelConfirm={handleCancelConfirm}
            />
        </>
    );
}
