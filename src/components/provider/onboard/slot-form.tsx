"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { TimePicker, Button as RsButton } from "rsuite";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "rsuite/dist/rsuite-no-reset.min.css";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import ConfettiBurst from "./confetti-burst";

const Required = () => <span className="text-red-500">*</span>;

const SlotSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  breakStartTime: z.string().min(1, "Break start is required"),
  breakEndTime: z.string().min(1, "Break end is required"),
  slotsDuration: z.string().min(1, "Slot duration is required"),
});

type SlotFormValues = z.infer<typeof SlotSchema>;

const formatTime = (date: Date | null) => {
  if (!date) return "";
  let hours: number | string = date.getHours();
  let minutes: string = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};

const slotOptions = [
  { value: "15", label: "15 Minutes", slots: "32 slots/day" },
  { value: "30", label: "30 Minutes", slots: "16 slots/day" },
  { value: "45", label: "45 Minutes", slots: "10 slots/day" },
  { value: "60", label: "1 Hour", slots: "8 slots/day" },
];

export default function SlotForm({
  onNext,
}: {
  onNext: (data: SlotFormValues) => void;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<SlotFormValues>({
    resolver: zodResolver(SlotSchema),
    defaultValues: {
      startTime: "09:00 AM",
      endTime: "06:00 PM",
      breakStartTime: "01:00 PM",
      breakEndTime: "02:00 PM",
      slotsDuration: "30",
    },
  });

  const headerImage = "/images/p/time-slot.jpg";

  const onSubmit = (values: SlotFormValues) => {
    console.log("🟦 Final Slot Values:", values); // ← required
    setLoading(true);

    setTimeout(() => {
      onNext(values);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md border overflow-hidden">
      {/* HEADER */}
      <div className="relative w-full h-36 sm:h-44 md:h-70">
        <img src={headerImage} className="w-full h-full object-contain" />
        <h2 className="absolute bottom-3 left-4 sm:left-6 text-lg sm:text-xl font-semibold text-black">
          Business Time Slots
        </h2>
      </div>

      {/* FORM */}
      <div className="p-5 sm:p-7">
        <Form {...form}>
          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
            onSubmit={form.handleSubmit(onSubmit)}>
            {/* OPENING TIME */}
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Opening Time <Required />
                  </FormLabel>
                  <FormControl>
                    <TimePicker
                      format="hh:mm aa"
                      className="w-full"
                      value={new Date(`01/01/2020 ${field.value}`)}
                      onChange={(v) => field.onChange(formatTime(v))}
                      placement="bottomStart"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CLOSING TIME */}
            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Closing Time <Required />
                  </FormLabel>
                  <FormControl>
                    <TimePicker
                      format="hh:mm aa"
                      className="w-full"
                      value={new Date(`01/01/2020 ${field.value}`)}
                      onChange={(v) => field.onChange(formatTime(v))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BREAK START */}
            <FormField
              control={form.control}
              name="breakStartTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Break Starts At <Required />
                  </FormLabel>
                  <FormControl>
                    <TimePicker
                      format="hh:mm aa"
                      className="w-full"
                      value={new Date(`01/01/2020 ${field.value}`)}
                      onChange={(v) => field.onChange(formatTime(v))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* BREAK END */}
            <FormField
              control={form.control}
              name="breakEndTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Break Ends At <Required />
                  </FormLabel>
                  <FormControl>
                    <TimePicker
                      format="hh:mm aa"
                      className="w-full"
                      value={new Date(`01/01/2020 ${field.value}`)}
                      onChange={(v) => field.onChange(formatTime(v))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SLOT DURATION SELECTION */}
            <FormField
              control={form.control}
              name="slotsDuration"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>
                    Slot Duration <Required />
                  </FormLabel>
                  <FormControl>
                    <div className="flex flex-wrap gap-2">
                      {slotOptions.map((opt) => (
                        <label
                          key={opt.value}
                          className={`relative flex items-center gap-4 py-2 px-4 rounded-md border-2 cursor-pointer transition-all w-fit
                            ${
                              field.value === opt.value
                                ? "border-green-600 bg-green-100 shadow-md"
                                : "border-gray-200 bg-white hover:border-green-300"
                            }
                          `}>
                          <input
                            type="radio"
                            name="slotDuration"
                            value={opt.value}
                            checked={field.value === opt.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="w-5 h-5"
                          />

                          <div>
                            <div className="font-semibold">{opt.label}</div>
                            <div className="text-sm text-gray-500">
                              {opt.slots}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* SUBMIT BUTTON */}
            <div className="sm:col-span-2 mt-4">
              <RsButton
                appearance="primary"
                type="submit"
                loading={loading}
                className="w-full !h-12 !bg-gray-800 !text:md">
                Complete Your Profile
              </RsButton>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
