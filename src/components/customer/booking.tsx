"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import ExploreHeader from "./explore/exploreHeroSection";
import { useRouter, useSearchParams } from "next/navigation";

// Large Components
import FiltersPanel from "@/components/customer/booking/FiltersPanel";
import BookingList from "@/components/customer/booking/BookingList";
import CancelBookingDialog from "@/components/customer/booking/CancelBookingDialog";
import { toast } from "sonner";
import FeedbackDialog from "./feedback/feedbackForm";

export default function CustomerBookingsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "date-desc");

  // UI States
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Cancel dialog states
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Feedback dialog
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [selectedBookingForFeedback, setSelectedBookingForFeedback] =
    useState<any>(null);

  /* ---------------- URL SYNC ---------------- */
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.set("search", searchQuery);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (sortBy !== "date-desc") params.set("sort", sortBy);

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  }, [searchQuery, statusFilter, sortBy, router]);

  /* ---------------- FETCH BOOKINGS ---------------- */
  const { data, isLoading, isError } = useQuery({
    queryKey: ["customer-bookings"],
    queryFn: async () => {
      const res = await fetch("/api/customer/booking", { cache: "no-store" });
      const result = await res.json();
      return result?.bookings || [];
    },
  });

  const bookings = data?.bookings || [];

  /* ---------------- FILTER & SORT ---------------- */
  const filteredBookings = useMemo(() => {
    if (!bookings) return [];

    let filtered = bookings.filter((booking: any) => {
      const matchesSearch =
        booking.service?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        booking.business?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        booking.bookingStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    filtered.sort((a: any, b: any) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-high":
          return b.totalAmount - a.totalAmount;
        case "price-low":
          return a.totalAmount - b.totalAmount;
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [bookings, searchQuery, statusFilter, sortBy]);

  /* ---------------- HELPERS ---------------- */
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
    return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  /* ---------------- ACTION HANDLERS ---------------- */
  const handleCancelClick = (booking: any) => {
    setSelectedBooking(booking);
    setCancelDialogOpen(true);
  };

  const handleFeedBackClick = (booking: any) => {
    setSelectedBookingForFeedback(booking);
    setFeedbackOpen(true);
  };

  const handleCancelConfirm = async ({ reason, reasonType }: any) => {
    if (!selectedBooking || isCancelling) return;

    setIsCancelling(true);

    try {
      const res = await fetch("/api/customer/booking/cancel", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          reason,
          reasonType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Unable to cancel booking.");
        return;
      }

      // Show detailed success message with refund info
      const refundInfo = data.data;

      if (refundInfo && refundInfo.refundAmount > 0) {
        toast.success(
          `Booking cancelled successfully! Refund of ₹${refundInfo.refundAmount} is being processed.${refundInfo.cancellationFee > 0
            ? ` (Cancellation fee: ₹${refundInfo.cancellationFee})`
            : ""
          }`,
          {
            duration: 6000,
          }
        );
      } else {
        toast.success("Booking cancelled successfully!");
      }

      await queryClient.invalidateQueries({
        queryKey: ["customer-bookings"],
      });

      setCancelDialogOpen(false);
      setSelectedBooking(null);
    } catch {
      toast.error("Something went wrong while cancelling.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleCopy = async (id: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("date-desc");
    router.replace(window.location.pathname, { scroll: false });
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
      <ExploreHeader
        totalServices={0}
        filteredCount={0}
        totalProviders={0}
        isVisible={false}
        heading="All Bookings"
        description="Your past and upcoming service booking history."
        icons={<Calendar className="w-8 h-8 text-gray-300" />}
      />

      <div className="min-h-screen bg-muted/50 py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between pb-10 gap-2">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search booking by name or provider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-gray-300 text-base w-full"
              />
            </div>
            <div className="flex lg:hidden">
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
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="hidden lg:block">
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
                handleFeedBackClick={handleFeedBackClick}
                handleCall={handleCall}
              />
            </div>
          </div>
        </div>
      </div>

      <CancelBookingDialog
        open={cancelDialogOpen}
        setOpen={setCancelDialogOpen}
        selectedBooking={selectedBooking}
        handleCancelConfirm={handleCancelConfirm}
        isLoading={isCancelling}
      />

      {selectedBookingForFeedback && (
        <FeedbackDialog
          open={feedbackOpen}
          close={() => {
            setFeedbackOpen(false);
            setSelectedBookingForFeedback(null);
          }}
          bookingId={selectedBookingForFeedback}
        />
      )}
    </>
  );
}
