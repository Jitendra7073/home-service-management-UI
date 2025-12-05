"use client";
import React, { useState, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";

const UserBookingsPage = () => {
  // Mock booking data
  const [bookings, setBookings] = useState([
    {
      id: "b1",
      serviceName: "Dog Grooming Service",
      providerName: "Global Pet Services",
      providerPhone: "1234567890",
      providerEmail: "admin@petservices.com",
      address: "123 Pet Lane, Premium Plaza, Surat",
      date: "2025-12-15",
      time: "10:00",
      endTime: "11:30",
      duration: 90,
      price: 1200,
      quantity: 1,
      status: "pending",
      category: "Pet Services",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: "b2",
      serviceName: "Cat Health Checkup",
      providerName: "Global Pet Services",
      providerPhone: "1234567890",
      providerEmail: "admin@petservices.com",
      address: "123 Pet Lane, Premium Plaza, Surat",
      date: "2025-12-10",
      time: "14:00",
      endTime: "14:45",
      duration: 45,
      price: 800,
      quantity: 1,
      status: "ongoing",
      category: "Pet Services",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: "b3",
      serviceName: "Small Pets Boarding",
      providerName: "Global Pet Services",
      providerPhone: "1234567890",
      providerEmail: "admin@petservices.com",
      address: "123 Pet Lane, Premium Plaza, Surat",
      date: "2025-12-05",
      time: "11:00",
      endTime: "12:00",
      duration: 1440,
      price: 500,
      quantity: 2,
      status: "completed",
      category: "Pet Services",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: "b4",
      serviceName: "Dog Grooming Service",
      providerName: "Global Pet Services",
      providerPhone: "1234567890",
      providerEmail: "admin@petservices.com",
      address: "123 Pet Lane, Premium Plaza, Surat",
      date: "2025-12-22",
      time: "09:00",
      endTime: "10:30",
      duration: 90,
      price: 1200,
      quantity: 1,
      status: "pending",
      category: "Pet Services",
      rating: 4.8,
      reviews: 124,
    },
    {
      id: "b5",
      serviceName: "Cat Health Checkup",
      providerName: "Global Pet Services",
      providerPhone: "1234567890",
      providerEmail: "admin@petservices.com",
      address: "123 Pet Lane, Premium Plaza, Surat",
      date: "2025-12-01",
      time: "16:00",
      endTime: "16:45",
      duration: 45,
      price: 800,
      quantity: 1,
      status: "cancelled",
      category: "Pet Services",
      rating: 4.8,
      reviews: 124,
    },
  ]);

  const [selectedTab, setSelectedTab] = useState("ongoing");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Categorize bookings
  const categorizedBookings = useMemo(() => {
    const upcoming: any[] = [];
    const ongoing: any[] = [];
    const past: any[] = [];

    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.date);
      bookingDate.setHours(0, 0, 0, 0);

      if (booking.status === "completed" || booking.status === "cancelled") {
        past.push(booking);
      } else if (booking.status === "ongoing") {
        ongoing.push(booking);
      } else {
        if (bookingDate >= today) {
          upcoming.push(booking);
        } else {
          past.push(booking);
        }
      }
    });

    upcoming.sort(
      (a: any, b: any) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    ongoing.sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    past.sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return { upcoming, ongoing, past };
  }, [bookings]);

  const currentBookings =
    selectedTab === "upcoming"
      ? categorizedBookings.upcoming
      : selectedTab === "ongoing"
      ? categorizedBookings.ongoing
      : categorizedBookings.past;

  const handleCancelBooking = () => {
    if (!selectedBooking) return;
    setBookings((prev: any[]) =>
      prev.map((b) =>
        b.id === selectedBooking.id ? { ...b, status: "cancelled" } : b
      )
    );
    setSelectedBooking(null);
    setShowCancelModal(false);
    setCancelReason("");
    setExpandedId(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-700 bg-yellow-50";
      case "ongoing":
        return "text-blue-700 bg-blue-50";
      case "completed":
        return "text-green-700 bg-green-50";
      case "cancelled":
        return "text-red-700 bg-red-50";
      default:
        return "text-gray-700 bg-gray-50";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "ongoing":
        return "⏱";
      case "completed":
        return "✓";
      case "cancelled":
        return "✕";
      default:
        return "•";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-black text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-1">Manage your service bookings</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            {
              id: "past",
              label: "Past",
              count: categorizedBookings.past.length,
              icon: "📜",
            },
            {
              id: "ongoing",
              label: "Ongoing",
              count: categorizedBookings.ongoing.length,
              icon: "⏱",
            },
            {
              id: "upcoming",
              label: "Upcoming",
              count: categorizedBookings.upcoming.length,
              icon: "📅",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedTab === tab.id
                  ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-gray-400"
              }`}>
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-900 px-2 py-0.5 rounded-full text-sm font-black">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="space-y-3">
          {currentBookings.length > 0 ? (
            currentBookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                {/* Booking Row */}
                <button
                  onClick={() =>
                    setExpandedId(expandedId === booking.id ? null : booking.id)
                  }
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    {/* Status & Date */}
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(
                          booking.status
                        )}`}>
                        <span>{getStatusIcon(booking.status)}</span>
                        {getStatusLabel(booking.status)}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">
                        {new Date(booking.date).toLocaleDateString("en-IN", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-sm font-semibold text-gray-600">
                        {booking.time}
                      </span>
                    </div>

                    {/* Service & Provider */}
                    <h3 className="text-lg font-black text-gray-900 mb-1">
                      {booking.serviceName}
                    </h3>
                    <p className="text-sm text-gray-600 font-semibold">
                      {booking.providerName}
                    </p>
                  </div>

                  {/* Price & Expand */}
                  <div className="flex items-center gap-4 ml-4">
                    <div className="text-right">
                      <div className="text-2xl font-black text-gray-900">
                        ₹{booking.price * booking.quantity}
                      </div>
                      <div className="text-xs text-gray-600 font-semibold">
                        Qty: {booking.quantity}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-400 transition-transform ${
                        expandedId === booking.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Expanded Details */}
                {expandedId === booking.id && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-6">
                    {/* Service Details */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                        Service Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category</span>
                          <span className="font-semibold text-gray-900">
                            {booking.category}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration</span>
                          <span className="font-semibold text-gray-900">
                            {booking.duration} minutes
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date & Time</span>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {new Date(booking.date).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                            <p className="text-xs text-gray-600">
                              {booking.time} - {booking.endTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Provider Details */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                        Provider Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Provider</span>
                          <span className="font-semibold text-gray-900">
                            {booking.providerName}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating</span>
                          <span className="font-semibold text-gray-900">
                            ⭐ {booking.rating} ({booking.reviews} reviews)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone</span>
                          <span className="font-semibold text-gray-900">
                            {booking.providerPhone}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email</span>
                          <span className="font-semibold text-gray-900 text-right break-all">
                            {booking.providerEmail}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-gray-600">Address</span>
                          <span className="font-semibold text-gray-900 text-right">
                            {booking.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">
                        Pricing
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">
                            Price per session
                          </span>
                          <span className="font-semibold text-gray-900">
                            ₹{booking.price}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quantity</span>
                          <span className="font-semibold text-gray-900">
                            × {booking.quantity}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 font-black text-gray-900">
                          <span>Total Amount</span>
                          <span>₹{booking.price * booking.quantity}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => setExpandedId(null)}
                        className="flex-1 py-3 rounded-xl font-bold bg-gray-200 text-gray-900 hover:bg-gray-300 transition-colors">
                        Close
                      </button>

                      {booking.status === "pending" && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowCancelModal(true);
                          }}
                          className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">
                          Cancel Booking
                        </button>
                      )}

                      {booking.status === "completed" && (
                        <button className="flex-1 py-3 rounded-xl font-bold bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                          Book Again
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">
                No {selectedTab} bookings
              </h3>
              <p className="text-gray-600">
                {selectedTab === "upcoming"
                  ? "You don't have any upcoming bookings. Book a service now!"
                  : selectedTab === "ongoing"
                  ? "You don't have any ongoing bookings."
                  : "You don't have any past bookings."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">
                Cancel Booking?
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this booking? This action cannot
                be undone.
              </p>

              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Tell us why you're cancelling (optional)"
                className="w-full p-4 border border-gray-200 rounded-xl resize-none mb-6 focus:outline-none focus:border-gray-400 text-sm"
                rows="3"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelReason("");
                  }}
                  className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors">
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="flex-1 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;
