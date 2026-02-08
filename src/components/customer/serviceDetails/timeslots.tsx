"use client";

import { useMemo, useState } from "react";

interface Slot {
  id: string;
  time: string; // "10:30 AM"
}

interface SlotsSelectorProps {
  slots: Slot[] | null | undefined;
  serviceId: string;
  businessId: string;
  onSelect: (data: {
    serviceId: string;
    slotId: string;
    businessId: string;
    date: string;
  }) => void;
}

export default function SlotsSelector({
  slots,
  serviceId,
  businessId,
  onSelect,
}: SlotsSelectorProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const safeSlots: Slot[] = Array.isArray(slots) ? slots : [];

  const next3Days = Array.from({ length: 3 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  const toMinutes = (time: string) => {
    const [hh, mm, period] = time.split(/[: ]/);
    let hour = Number(hh) % 12;
    if (period === "PM") hour += 12;
    return hour * 60 + Number(mm);
  };

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const slotsForDate = useMemo(() => {
    if (!selectedDate) return [];

    const today = new Date().toISOString().split("T")[0];
    const isToday = selectedDate === today;

    return safeSlots
      .filter((slot) => {
        if (!isToday) return true;
        return toMinutes(slot.time) > currentMinutes;
      })
      .sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  }, [selectedDate, safeSlots]);

  const handleSelect = (slot: Slot) => {
    setSelectedSlotId(slot.id);

    onSelect({
      serviceId,
      slotId: slot.id,
      businessId,
      date: selectedDate!,
    });
  };

  return (
    <div className="bg-white border rounded-sm p-6 shadow-sm">
      <h2 className="text-xl font-bold mb-4">Select Date & Time</h2>

      {/* DATE SELECTOR */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {next3Days.map((date) => (
          <button
            key={date}
            onClick={() => {
              setSelectedDate(date);
              setSelectedSlotId(null);
            }}
            className={`px-4 py-2 rounded-sm border text-sm font-semibold whitespace-nowrap ${selectedDate === date
                ? "bg-black text-white border-black"
                : "bg-gray-50 text-gray-900 border-gray-200 hover:bg-gray-100"
              }`}>
            {new Date(date).toLocaleDateString("en-IN", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </button>
        ))}
      </div>

      {/* TIME SLOTS */}
      {!selectedDate ? (
        <p className="text-gray-500">Please select a date above.</p>
      ) : slotsForDate.length === 0 ? (
        <p className="text-gray-500">No slots available for this date.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {slotsForDate.map((slot) => (
            <button
              key={slot.id}
              onClick={() => handleSelect(slot)}
              className={`p-3 rounded-sm text-center border-2 text-sm font-semibold ${selectedSlotId === slot.id
                  ? "bg-green-100 border-green-300 text-green-600 shadow"
                  : "bg-white border-gray-200 hover:border-green-400 hover:bg-green-50"
                }`}>
              {slot.time}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
