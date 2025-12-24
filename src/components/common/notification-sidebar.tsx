"use client";

import React, { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Bell,
  X,
  CalendarClock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const NOTIFICATION_QUERY_KEY = ["notifications"];

const NotificationSideBar = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  /* ---------------- FETCH NOTIFICATIONS ---------------- */
  const { data, isLoading, isError } = useQuery({
    queryKey: NOTIFICATION_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/notification/all");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
  });

  const notifications = data?.notifications ?? [];

  const unreadNotifications = notifications.filter(
    (n: any) => n.read === false
  );

  /* ---------------- MARK AS READ ---------------- */
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const res = await fetch(`/api/notification/all`, {
        method: "PATCH",
        body: JSON.stringify({ notificationId }),
      });
      if (!res.ok) throw new Error("Failed to update notification");
    },

    // Optimistic UI update
    onMutate: async (id) => {
      await queryClient.cancelQueries(NOTIFICATION_QUERY_KEY);

      const previous = queryClient.getQueryData(NOTIFICATION_QUERY_KEY);

      queryClient.setQueryData(NOTIFICATION_QUERY_KEY, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notifications: old.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        };
      });

      return { previous };
    },

    onError: (_, __, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATION_QUERY_KEY, context.previous);
      }
      toast.error("Failed to update notification");
    },
  });

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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={26} className="text-primary" />

          {unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
              {unreadNotifications.length}
            </span>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[330px] p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h2 className="text-xl font-semibold">Notifications</h2>
        </div>

        {/* Body */}
        <div className="max-h-[calc(100vh-80px)] overflow-y-auto">
          {isLoading ? (
            <p className="text-center py-6 text-muted-foreground">
              Loading notifications...
            </p>
          ) : isError ? (
            <p className="text-center py-6 text-red-500">
              Failed to load notifications
            </p>
          ) : unreadNotifications.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">
              No new notifications
            </p>
          ) : (
            <ul className="divide-y">
              {unreadNotifications.map((notify) => (
                <li
                  key={notify.id}
                  className="flex justify-between items-start p-4 hover:bg-accent transition">
                  {/* ICON + TEXT */}
                  <div className="flex gap-3">
                    <div className="p-2 rounded-md bg-muted">
                      {getTypeIcon(notify.type)}
                    </div>

                    <div>
                      <p className="font-medium text-sm">{notify.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {notify.message}
                      </p>
                      <span className="text-[11px] text-muted-foreground block mt-1">
                        {notify.time}
                      </span>
                    </div>
                  </div>

                  {/* MARK AS READ */}
                  <button
                    onClick={() => markAsReadMutation.mutate(notify.id)}
                    className="text-muted-foreground hover:text-primary">
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationSideBar;
