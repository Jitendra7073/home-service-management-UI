"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

interface PageProps {
  params: Promise<{ staffId: string }>;
}

export default function StaffAvailabilityPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Weekly schedule state
  const [weeklySchedule, setWeeklySchedule] = useState(
    DAYS_OF_WEEK.map((day) => ({
      dayOfWeek: day.value,
      startTime: "9:00 AM",
      endTime: "5:00 PM",
      isAvailable: false,
    })),
  );

  const handleDayToggle = (dayIndex: number) => {
    setWeeklySchedule((prev) =>
      prev.map((day, i) =>
        i === dayIndex ? { ...day, isAvailable: !day.isAvailable } : day,
      ),
    );
  };

  const handleTimeChange = (
    dayIndex: number,
    field: "startTime" | "endTime",
    value: string,
  ) => {
    setWeeklySchedule((prev) =>
      prev.map((day, i) => (i === dayIndex ? { ...day, [field]: value } : day)),
    );
  };

  const handleSubmit = async () => {
    setIsSaving(true);

    try {
      const res = await fetch("/api/staff/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          staffId: resolvedParams.staffId,
          weeklySchedule: weeklySchedule.filter((day) => day.isAvailable),
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success("Availability saved successfully!");
        router.back();
      } else {
        toast.error(result.msg || "Failed to save availability");
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error("Failed to save availability");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex w-full justify-center min-h-screen">
      <div className="w-full max-w-4xl px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Staff Details
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Availability
            </h1>
            <p className="text-gray-600 mt-2">
              Set weekly working hours for this staff member
            </p>
          </div>
        </div>

        {/* Weekly Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {DAYS_OF_WEEK.map((day, index) => {
              const schedule = weeklySchedule[index];
              return (
                <div
                  key={day.value}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center h-11">
                    <Checkbox
                      id={`day-${index}`}
                      checked={schedule.isAvailable}
                      onCheckedChange={() => handleDayToggle(index)}
                    />
                  </div>
                  <Label htmlFor={`day-${index}`} className="w-32 font-medium">
                    {day.label}
                  </Label>
                  {schedule.isAvailable && (
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <Label className="text-sm mb-1">Start Time</Label>
                        <Input
                          type="time"
                          value={schedule.startTime.replace(" ", "")}
                          onChange={(e) =>
                            handleTimeChange(index, "startTime", e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                      <span className="text-gray-500">to</span>
                      <div className="flex-1">
                        <Label className="text-sm mb-1">End Time</Label>
                        <Input
                          type="time"
                          value={schedule.endTime.replace(" ", "")}
                          onChange={(e) =>
                            handleTimeChange(index, "endTime", e.target.value)
                          }
                          className="text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              How Availability Works
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check the days this staff member is available to work</li>
              <li>• Set working hours for each day</li>
              <li>
                • Staff will only be assigned to bookings during their available
                hours
              </li>
              <li>• Customers will see availability when booking services</li>
            </ul>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Availability"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
