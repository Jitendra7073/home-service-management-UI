"use client";

import React, { useState } from "react";
import Link from "next/link";

import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Bell,
  X,
  CalendarClock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  type: "success" | "warning" | "info";
}

const NotificationSideBar = () => {
  const [open, setOpen] = useState(false);

  // Fake Notification Data (UI only)
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: "Booking Confirmed",
      message: "Your AC Repair booking has been confirmed.",
      time: "2 min ago",
      type: "success",
    },
    {
      id: 2,
      title: "Provider On The Way",
      message: "John will arrive at your location in 15 minutes.",
      time: "10 min ago",
      type: "info",
    },
    {
      id: 3,
      title: "Booking Delayed",
      message: "Your Plumbing service is delayed due to traffic.",
      time: "30 min ago",
      type: "warning",
    },
  ]);

  // Remove Notification
  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Get icon by type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-600" />;
      case "warning":
        return <AlertTriangle size={20} className="text-yellow-600" />;
      default:
        return <CalendarClock size={20} className="text-blue-600" />;
    }
  };

  return (
    <div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Bell size={26} className="text-primary" />
          </Button>
        </SheetTrigger>

        <SheetContent side="right" className="w-[330px] p-0">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>

          {/* Notification List */}
          <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">
                No notifications
              </p>
            ) : (
              <ul className="divide-y">
                {notifications.map((notify) => (
                  <li
                    key={notify.id}
                    className="flex justify-between items-start p-4 hover:bg-accent transition-colors">
                    {/* ICON + TEXT */}
                    <div className="flex gap-3 items-start">
                      {/* Icon */}
                      <div className="p-2 rounded-md bg-muted">
                        {getTypeIcon(notify.type)}
                      </div>

                      {/* Notification Details */}
                      <div>
                        <p className="font-medium text-sm">{notify.title}</p>
                        <p className="text-xs text-muted-foreground leading-tight">
                          {notify.message}
                        </p>
                        <span className="text-[11px] text-muted-foreground block mt-1">
                          {notify.time}
                        </span>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeNotification(notify.id)}
                      className="text-muted-foreground hover:text-primary transition">
                      <X size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NotificationSideBar;
