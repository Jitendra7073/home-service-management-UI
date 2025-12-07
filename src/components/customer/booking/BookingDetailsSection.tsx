"use client";

import { Button } from "@/components/ui/button";
import { Clock, Star, Phone, Mail, Globe, User, X, Download } from "lucide-react";
import CopyField from "@/components/customer/booking/CopyField";

export default function BookingDetailsSection({
    booking,
    handleCopy,
    copiedField,
    formatDateTime,
    handleCancelClick,
    handleDownloadInvoice,
    handleCall
}: any) {
    return (
        <div className="border-t border-gray-100 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                {/* SERVICE DETAILS */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                        <div className="w-1 h-4 bg-gray-700 rounded-full"></div>
                        Service Details
                    </h4>

                    <div className="space-y-3 pl-3">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Description</p>
                            <p className="text-sm text-gray-700">{booking.service.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Duration</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {booking.service.durationInMinutes} mins
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-500 mb-1">Rating</p>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {booking.service.averageRating.toFixed(1)}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({booking.service.reviewCount})
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* BOOKING INFORMATION */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                        <div className="w-1 h-4 bg-gray-700 rounded-full"></div>
                        Booking Information
                    </h4>

                    <div className="space-y-3 pl-3">

                        {/* BOOKING ID */}
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 mb-1">Booking ID</p>
                            <div onClick={() => handleCopy("bookingId", booking.id)} className="cursor-pointer">
                                <CopyField
                                    id="bookingId"
                                    value={booking.id}
                                    copiedField={copiedField}
                                    onCopy={handleCopy}
                                />

                            </div>
                        </div>

                        {/* SERVICE ID */}
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 mb-1">Service ID</p>
                            <div onClick={() => handleCopy("serviceId", booking.service.id)} className="cursor-pointer">
                                <CopyField
                                    id="serviceId"
                                    value={booking.service.id}
                                    copiedField={copiedField}
                                    onCopy={handleCopy}
                                />
                            </div>
                        </div>

                        {/* SLOT ID */}
                        <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 mb-1">Slot ID</p>
                            <div onClick={() => handleCopy("slotId", booking.slotId)} className="cursor-pointer">
                                <CopyField
                                    id="slotId"
                                    value={booking.slotId}
                                    copiedField={copiedField}
                                    onCopy={handleCopy}
                                />
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 mb-1">Created At</p>
                            <p className="text-sm text-gray-700">{formatDateTime(booking.createdAt)}</p>
                        </div>
                    </div>
                </div>

                {/* BUSINESS DETAILS */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                        <div className="w-1 h-4 bg-gray-700 rounded-full"></div>
                        Business Details
                    </h4>

                    <div className="space-y-3 pl-3">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Business Name</p>
                            <p className="text-sm font-medium text-gray-900">
                                {booking.slot.businessProfile.businessName}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <Phone className="w-3 h-3" /> Phone
                            </p>
                            <p className="text-sm text-gray-700">
                                {booking.slot.businessProfile.phoneNumber}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <Mail className="w-3 h-3" /> Email
                            </p>
                            <p className="text-sm text-gray-700 break-all">
                                {booking.slot.businessProfile.contactEmail}
                            </p>
                        </div>

                        {booking.slot.businessProfile.websiteURL && (
                            <div>
                                <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> Website
                                </p>

                                <a
                                    href={booking.slot.businessProfile.websiteURL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600  break-all"
                                >
                                    {booking.slot.businessProfile.websiteURL}
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* PROVIDER DETAILS */}
                <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                        <div className="w-1 h-4 bg-gray-700 rounded-full"></div>
                        Provider Information
                    </h4>

                    <div className="space-y-3 pl-3">
                        <div>
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                <User className="w-3 h-3" /> Provider Name
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {booking.slot.businessProfile.user.name}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 mb-1">Provider Email</p>
                            <p className="text-sm text-gray-700 break-all">
                                {booking.slot.businessProfile.user.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 mb-1">Provider Mobile</p>
                            <p className="text-sm text-gray-700">
                                {booking.slot.businessProfile.user.mobile}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-500 mb-1">Member Since</p>
                            <p className="text-sm text-gray-700">
                                {formatDateTime(booking.slot.businessProfile.user.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">

                {/* Cancel (only pending) */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelClick(booking)}
                    disabled={!["Pending", "Onhold"].includes(booking.status)}
                    className="flex items-center gap-2 border-red-300 text-red-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50"
                >
                    <X className="w-4 h-4" />
                    Cancel Booking
                </Button>

                {/* Invoice download */}
                <Button
                    variant="outline"
                    size="sm"
                    disabled={!["Confirmed", "Completed", "Refunded"].includes(booking.status)}
                    onClick={() => handleDownloadInvoice(booking)}
                    className="flex items-center gap-2 border-gray-300 cursor-pointer  disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download className="w-4 h-4" />
                    Download Invoice
                </Button>

                {/* Call provider (always enabled) */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCall(booking.slot.businessProfile.user.mobile)}
                    className="flex items-center gap-2 cursor-pointer border-gray-300"
                >
                    <Phone className="w-4 h-4" />
                    Call Provider
                </Button>

            </div>

        </div>
    );
}
