"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Check,
  UserPlus,
  RefreshCw,
  AlertCircle,
  Circle,
  IndianRupee,
  Percent,
} from "lucide-react";
import { toast } from "sonner";

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
}

export function AssignStaffModal({
  isOpen,
  onClose,
  bookingId,
}: AssignStaffModalProps) {
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [showReassign, setShowReassign] = useState(false);

  // Payment configuration state
  const [paymentType, setPaymentType] = useState<"PERCENTAGE" | "FIXED_AMOUNT">(
    "PERCENTAGE",
  );
  const [paymentValue, setPaymentValue] = useState<string>("50");

  const queryClient = useQueryClient();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      console.log("[AssignStaffModal] Dialog opened for booking:", bookingId);
      setShowReassign(false);
      setSelectedStaffId("");
      setPaymentType("PERCENTAGE");
      setPaymentValue("50");
    } else {
      console.log("[AssignStaffModal] Dialog closed");
    }
  }, [isOpen]);

  // Fetch booking details to check if staff is already assigned
  const { data: bookingData, isLoading: isLoadingBooking } = useQuery({
    queryKey: ["booking-details", bookingId],
    queryFn: async () => {
      const res = await fetch(`/api/provider/bookings/${bookingId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch booking details");
      const data = await res.json();
      console.log("[AssignStaffModal] Booking details fetched:", data);
      return data;
    },
    enabled: isOpen,
  });



  // Fetch approved staff with availability status
  const bookingDate = bookingData?.booking?.date;

  const { data: staffData, isLoading: isLoadingStaff } = useQuery({
    queryKey: ["provider-staff-assignable", bookingId, bookingDate],
    queryFn: async () => {
      console.log("[AssignStaffModal] queryFn called. bookingDate:", bookingDate);
      let url = `/api/provider/staff?isApproved=true&limit=100`;
      if (bookingDate) {
        url += `&date=${encodeURIComponent(bookingDate)}`;
      }
      console.log("[AssignStaffModal] Fetching staff with URL:", url);
      const res = await fetch(url, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch staff");
      const data = await res.json();
      console.log("[AssignStaffModal] Staff data fetched:", data);
      return data;
    },
    enabled: isOpen,
  });

  const assignMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        bookingId,
        staffId: selectedStaffId,
        staffPaymentType: paymentType,
        staffPaymentValue: parseFloat(paymentValue),
      };

      console.log("[AssignStaffModal] Assigning staff:", payload);

      const res = await fetch("/api/provider/assign_booking", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Failed to assign booking");
      return data;
    },
    onSuccess: () => {
      toast.success("Staff assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["provider-bookings"] });
      queryClient.invalidateQueries({
        queryKey: ["booking-details", bookingId],
      });
      queryClient.invalidateQueries({
        queryKey: ["provider-staff-assignable"],
      });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleAssign = () => {
    if (!selectedStaffId) {
      toast.error("Please select a staff member");
      return;
    }

    // Validate payment value
    const value = parseFloat(paymentValue);
    if (isNaN(value) || value < 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (paymentType === "PERCENTAGE" && value > 100) {
      toast.error("Percentage cannot exceed 100%");
      return;
    }

    console.log("[AssignStaffModal] Handle assign clicked. Selected ID:", selectedStaffId);
    assignMutation.mutate();
  };

  const staffList = staffData?.staffProfiles || [];
  const booking = bookingData?.booking;

  // Get assigned staff from booking
  const assignedStaffData = booking?.StaffAssignBooking?.[0];

  // Check if booking is already assigned
  const isAlreadyAssigned = !!assignedStaffData;

  // Create a combined staff list that includes the assigned staff even if not in the main list
  const assignedStaffInfo = assignedStaffData
    ? {
      id: assignedStaffData.assignedStaffId,
      user: {
        name: assignedStaffData.staff?.name || "Staff Member",
        email: assignedStaffData.staff?.email,
        mobile: assignedStaffData.staff?.mobile,
      },
      _count: {
        bookings: 1, // At least this booking
      },
      availability: "AVAILABLE", // Assigned staff is considered available
      status: "APPROVED",
    }
    : null;

  // Combine staff: assigned staff + other staff
  const allStaff = assignedStaffInfo
    ? [
      assignedStaffInfo,
      ...staffList.filter((s: any) => s.id !== assignedStaffInfo.id),
    ]
    : staffList;

  // Separate staff by availability status
  const assignedStaff = assignedStaffInfo;
  const availableStaff = allStaff.filter(
    (s: any) =>
      s.id !== assignedStaffInfo?.id &&
      s.status === "APPROVED" &&
      s.availability === "AVAILABLE",
  );





  const onWorkStaff = allStaff.filter(
    (s: any) =>
      s.id !== assignedStaffInfo?.id &&
      s.status === "APPROVED" &&
      s.availability === "ON_WORK",
  );

  const busyStaff = allStaff.filter(
    (s: any) =>
      s.id !== assignedStaffInfo?.id &&
      s.status === "APPROVED" &&
      s.availability === "BUSY",
  );

  console.log("[AssignStaffModal] Filtered Staff:", {
    total: allStaff.length,
    assigned: assignedStaff?.id,
    available: availableStaff.length,
    onWork: onWorkStaff.length,
    busy: busyStaff.length
  });

  const isLoading = isLoadingBooking || isLoadingStaff;

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "AVAILABLE":
        return "fill-green-500";
      case "NOT_AVAILABLE":
        return "fill-red-500";
      case "ON_WORK":
        return "fill-blue-500";
      case "BUSY":
        return "fill-orange-500";
      default:
        return "fill-gray-400";
    }
  };

  const getAvailabilityLabel = (availability: string) => {
    switch (availability) {
      case "AVAILABLE":
        return "Available";
      case "NOT_AVAILABLE":
        return "Not Available";
      case "ON_WORK":
        return "On Work";
      case "BUSY":
        return "Busy";
      default:
        return "Unknown";
    }
  };

  const getAvailabilityMessage = (staff: any) => {
    switch (staff.availability) {
      case "NOT_AVAILABLE":
        return staff.leaveDetails
          ? `On leave: ${staff.leaveDetails.reason || "Scheduled Leave"}`
          : staff.currentBooking?.leaveReason
            ? `On leave: ${staff.currentBooking.leaveReason}`
            : "Marked as not available";
      case "ON_WORK":
        return staff.currentBooking
          ? `Working on: ${staff.currentBooking.service}`
          : "Currently working";
      case "BUSY":
        return staff.currentBooking
          ? `Active booking: ${staff.currentBooking.service}`
          : "Has active bookings";
      default:
        return null;
    }
  };

  const StaffCard = ({
    staff,
    isAssigned = false,
    isDisabled = false,
  }: any) => {
    const isSelected = selectedStaffId === staff.id;
    const isUnavailable =
      staff.availability === "BUSY" ||
      staff.availability === "ON_WORK" ||
      staff.availability === "NOT_AVAILABLE";

    return (
      <div
        onClick={() => {
          if (!isDisabled) {
            console.log("[AssignStaffModal] Selected staff:", staff.id);
            setSelectedStaffId(staff.id);
          }
        }}
        className={`
          relative p-4 rounded-sm border-2 transition-all cursor-pointer
          ${isSelected
            ? "border-blue-500 bg-blue-50"
            : isAssigned
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300 bg-white"
          }
          ${isDisabled && !isAssigned ? "opacity-60 cursor-not-allowed" : ""}
        `}>
        {isAssigned && (
          <div className="absolute top-2 right-2">
            <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-sm">
              Assigned
            </span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={staff.user?.photo} />
            <AvatarFallback className="bg-gray-100 text-gray-600">
              {staff.user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">
                {staff.user?.name}
              </h4>
              <div className="flex items-center gap-1">
                {isAssigned ? (
                  <>
                    <Circle className="h-2 w-2 fill-green-500" />
                    <span className="text-xs text-gray-500">Assigned</span>
                  </>
                ) : (
                  <>
                    <Circle
                      className={`h-2 w-2 ${getAvailabilityColor(
                        staff.availability,
                      )}`}
                    />
                    <span className="text-xs text-gray-500">
                      {getAvailabilityLabel(staff.availability)}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{staff._count?.bookings || 0} bookings</span>
              {staff.currentBooking && isUnavailable && (
                <span className="truncate">{staff.currentBooking.service}</span>
              )}
            </div>
          </div>

          {!isDisabled && isSelected && (
            <div className="h-6 w-6 rounded-sm bg-blue-500 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {isUnavailable && getAvailabilityMessage(staff) && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {getAvailabilityMessage(staff)}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            {isAlreadyAssigned ? "Assigned Staff" : "Assign Staff"}
          </DialogTitle>
        </DialogHeader>

        {/* Payment Configuration Section - Only show when assigning/reassigning */}
        {(!isAlreadyAssigned || showReassign) && (
          <div className="px-6 py-4 border-b bg-gray-50">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              Staff Payment Configuration
            </p>

            {/* Payment Type Selector */}
            <div className="flex gap-3 mb-4">
              <button
                type="button"
                onClick={() => {
                  setPaymentType("PERCENTAGE");
                  setPaymentValue("50");
                }}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-sm border-2 transition-all
                  ${paymentType === "PERCENTAGE"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }
                `}>
                <Percent className="w-4 h-4" />
                <span className="font-medium text-sm">Percentage</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentType("FIXED_AMOUNT");
                  setPaymentValue("0");
                }}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-sm border-2 transition-all
                  ${paymentType === "FIXED_AMOUNT"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }
                `}>
                <IndianRupee className="w-4 h-4" />
                <span className="font-medium text-sm">Fixed Amount</span>
              </button>
            </div>

            {/* Payment Value Input */}
            <div className="space-y-2">
              <Label htmlFor="paymentValue" className="text-sm text-gray-600">
                {paymentType === "PERCENTAGE"
                  ? "Percentage of provider earnings"
                  : "Fixed amount (in currency)"}
              </Label>
              <div className="relative">
                <Input
                  id="paymentValue"
                  type="number"
                  value={paymentValue}
                  onChange={(e) => setPaymentValue(e.target.value)}
                  min={paymentType === "PERCENTAGE" ? "0" : "0"}
                  max={paymentType === "PERCENTAGE" ? "100" : undefined}
                  step={paymentType === "PERCENTAGE" ? "1" : "0.01"}
                  className="pr-12"
                  placeholder={paymentType === "PERCENTAGE" ? "50" : "0.00"}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  {paymentType === "PERCENTAGE" ? "%" : "₹"}
                </div>
              </div>

              {/* Preview calculation */}
              {bookingData?.booking && (
                <p className="text-xs text-gray-500 mt-2">
                  {paymentType === "PERCENTAGE"
                    ? `Staff will receive ${paymentValue}% of provider earnings`
                    : `Staff will receive ₹${parseFloat(
                      paymentValue || "0",
                    ).toFixed(2)} fixed amount`}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (availableStaff.length === 0 && onWorkStaff.length === 0 && busyStaff.length === 0 && !isAlreadyAssigned) ? (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No available staff members</p>
              <p className="text-xs text-gray-400 mt-1">
                All staff are currently unavailable or on leave.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Assigned Staff - Always show first if assigned */}
              {isAlreadyAssigned && assignedStaff && !showReassign && (
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                    Assigned Staff
                  </p>
                  <StaffCard
                    staff={assignedStaff}
                    isAssigned={true}
                    isDisabled={true}
                  />
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-sm">
                    <p className="text-sm text-green-800">
                      ✓ This booking is assigned to{" "}
                      <strong>{assignedStaff.user?.name}</strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Reassignment Warning */}
              {isAlreadyAssigned && showReassign && (
                <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-sm">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium mb-1">Reassigning staff</p>
                    <p className="text-amber-700">
                      Currently assigned:{" "}
                      <strong>{assignedStaff?.user?.name}</strong>
                    </p>
                    <p className="text-amber-600 text-xs mt-1">
                      Select a new staff member below to reassign this booking
                    </p>
                  </div>
                </div>
              )}

              {/* Available Staff */}
              {availableStaff.length > 0 &&
                (!isAlreadyAssigned || showReassign) && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                      {isAlreadyAssigned ? "Reassign To:" : "Available Staff"}
                    </p>
                    <div className="space-y-2">
                      {availableStaff.map((staff: any) => (
                        <StaffCard
                          key={staff.id}
                          staff={staff}
                          isDisabled={false}
                        />
                      ))}
                    </div>
                  </div>
                )}





              {/* Toggle Reassign Mode */}
              {isAlreadyAssigned &&
                !showReassign &&
                (availableStaff.length > 0 ||
                  onWorkStaff.length > 0 ||
                  busyStaff.length > 0) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReassign(true)}
                    className="w-full text-gray-600 hover:text-gray-900 mt-4">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reassign to different staff
                  </Button>
                )}

              {/* Cancel Reassign */}
              {isAlreadyAssigned && showReassign && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowReassign(false);
                    setSelectedStaffId("");
                  }}
                  className="w-full text-gray-500">
                  Cancel reassignment
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={assignMutation.isPending}
            className="text-gray-600">
            Cancel
          </Button>
          {(!isAlreadyAssigned || showReassign) && (
            <Button
              onClick={handleAssign}
              disabled={!selectedStaffId || assignMutation.isPending}
              className="min-w-[120px]">
              {assignMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  {isAlreadyAssigned ? "Reassign" : "Assign"}
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
