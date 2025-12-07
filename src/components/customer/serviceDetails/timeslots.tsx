"use client";

import { useMemo, useEffect, useState } from "react";

interface Slot {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

interface SlotsSelectorProps {
    slots: Slot[];
    selectedSlot: Slot | null;
    setSelectedSlot: (slot: Slot | null) => void;
}

export default function SlotsSelector({
    slots,
    selectedSlot,
    setSelectedSlot,
}: SlotsSelectorProps) {
    const groupedSlots = useMemo(() => {
        const map: Record<string, Slot[]> = {};
        if (!slots) return map;

        slots.forEach((slot) => {
            const dateStr = new Date(slot.date).toLocaleDateString("en-IN", {
                weekday: "short",
                month: "short",
                day: "numeric",
            });

            if (!map[dateStr]) map[dateStr] = [];
            map[dateStr].push(slot);
        });

        return map;
    }, [slots]);

    const availableDates = useMemo(() => Object.keys(groupedSlots), [groupedSlots]);

    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    useEffect(() => {
        if (!selectedDate && availableDates.length > 0) {
            setSelectedDate(availableDates[0]);
        }
    }, [availableDates, selectedDate]);

    const slotsForDate: Slot[] = selectedDate ? groupedSlots[selectedDate] || [] : [];

    const availableSlotsCount = slotsForDate.filter((s) => !s.isBooked).length;

    const handleSlotSelect = (slot: Slot) => {
        if (!slot.isBooked) {
            setSelectedSlot(slot);
        }
    };

    return (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                    Select Date & Time
                </h2>
                <div>
                    {availableSlotsCount > 0 ? (

                        <div className="text-xs sm:text-sm font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-sm">
                            ✓ {availableSlotsCount} Slots Available
                        </div>
                    ) : availableSlotsCount === 0 ? (
                        <div className="text-xs sm:text-sm font-semibold text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-sm">
                            ● All Slots Booked
                        </div>
                    ) : (
                        <div className="text-xs sm:text-sm font-semibold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-sm">
                            ● No Slots Added Yet
                        </div>
                    )}
                </div>

            </div>

            {/* Dates Buttons */}
            {availableDates.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-3 mb-6 -mx-1 px-1">
                    {availableDates.map((date) => (
                        <button
                            key={date}
                            onClick={() => {
                                setSelectedDate(date);
                                setSelectedSlot(null);
                            }}
                            className={`px-5 py-3 rounded-md text-sm sm:text-base font-semibold whitespace-nowrap transition-all border ${selectedDate === date
                                ? "bg-gray-900 text-white border-gray-900 shadow-lg shadow-gray-400/30"
                                : "bg-gray-50 text-gray-800 border-gray-200 hover:border-gray-400 hover:bg-gray-100"
                                }`}
                        >
                            {date}
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-sm mb-4">No slots available.</p>
            )}

            {/* Time Slots */}
            {slotsForDate.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {slotsForDate.map((slot) => (
                        <button
                            key={slot.id}
                            onClick={() => handleSlotSelect(slot)}
                            disabled={slot.isBooked}
                            className={`p-4 rounded-md text-sm font-semibold transition-all text-center border-2 ${slot.isBooked
                                ? "bg-red-100 text-red-500 border-red-300 cursor-not-allowed opacity-80"
                                : selectedSlot?.id === slot.id
                                    ? "bg-green-100 text-green-500 border-green-300 shadow-md shadow-green-300/40"
                                    : "bg-white text-gray-900 border-gray-200 hover:border-green-400 hover:bg-green-50"
                                }`}
                        >
                            <div className="font-black text-sm">
                                {slot.startTime} - {slot.endTime}
                            </div>
                            <div className="text-[14px] mt-1">
                                {slot.isBooked ? (
                                    <p className="text-red-500">Booked</p>
                                ) : (
                                    <p className="text-green-500">Available</p>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <div className="text-4xl mb-2">🕒</div>
                    <p className="text-gray-700 font-medium">No slots for this date</p>
                </div>
            )}
        </div>
    );
}
