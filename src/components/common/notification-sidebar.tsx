"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Bell, X, RefreshCw, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const NOTIFICATION_QUERY_KEY = ["notifications"];

/* Format time as relative (e.g., "2 minutes ago") */
const getRelativeTime = (createdAt: string) => {
  const now = new Date();
  const notificationTime = new Date(createdAt);
  const seconds = Math.floor(
    (now.getTime() - notificationTime.getTime()) / 1000,
  );

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return notificationTime.toLocaleDateString();
};

const NotificationSkeleton = () => {
  return [...Array(5)].map((_, index) => {
    return (
      <div
        className="px-4 py-3 border-b last:border-b-0 animate-pulse"
        key={index}>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-3 bg-gray-200 rounded w-full" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  });
};

const NotificationItem = ({
  notify,
  onDismiss,
}: {
  notify: any;
  onDismiss: (id: string) => void;
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={(_, info) => {
        // Swipe threshold (left or right)
        if (Math.abs(info.offset.x) > 100) {
          onDismiss(notify.id);
        }
      }}
      whileDrag={{ scale: 1.02, cursor: "grabbing", zIndex: 10 }}
      className="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 bg-white transition flex justify-between items-start group cursor-grab active:cursor-grabbing touch-pan-y relative will-change-transform">
      <div className="flex-1 min-w-0 pointer-events-none select-none">
        <p className="font-medium text-sm text-gray-900">{notify.title}</p>
        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
          {notify.message}
        </p>
        <span className="text-xs text-gray-400 mt-1 block">
          {getRelativeTime(notify.createdAt)}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent drag interference if any
          onDismiss(notify.id);
        }}
        className="ml-2 text-gray-400 hover:text-gray-600 shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors pointer-events-auto">
        <X size={16} />
      </button>
    </motion.div>
  );
};

const NotificationSideBar = () => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  /* ---------------- FETCH NOTIFICATIONS ---------------- */
  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: NOTIFICATION_QUERY_KEY,
    queryFn: async () => {
      const res = await fetch("/api/notification/all");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
  });

  const notifications = data?.notifications ?? [];

  const unreadNotifications = notifications.filter(
    (n: any) => n.read === false,
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
      // Optimistically remove the notification from the list
      // We don't necessarily need to cancel queries if we are just modifying cache
      // But adhering to standard pattern:
      await queryClient.cancelQueries({
        queryKey: NOTIFICATION_QUERY_KEY,
      });

      const previous = queryClient.getQueryData(NOTIFICATION_QUERY_KEY);

      queryClient.setQueryData(NOTIFICATION_QUERY_KEY, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          notifications: old.notifications.map((n: any) =>
            n.id === id ? { ...n, read: true } : n,
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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          suppressHydrationWarning>
          <Bell size={26} className="text-primary" />

          {unreadNotifications.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
              {unreadNotifications.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetTitle></SheetTitle>
      <SheetDescription></SheetDescription>

      <SheetContent
        side="right"
        className="w-[380px] sm:w-[420px] p-0 bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white px-4 py-4 border-b border-gray-200 flex items-center justify-between shadow-sm">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            <p className="text-xs text-muted-foreground">
              Swipe left or right to dismiss
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isFetching || isLoading}
            className="h-8 w-8">
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {/* Body */}
        <div className="max-h-[calc(100vh-100px)] overflow-y-auto no-scrollbar">
          {isLoading ? (
            <NotificationSkeleton />
          ) : isError ? (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="p-3 bg-red-100 rounded-full mb-3">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <p className="text-center text-sm text-gray-600">
                Failed to load notifications
              </p>
              <p className="text-center text-xs text-gray-500 mt-1">
                Please refresh and try again
              </p>
            </div>
          ) : unreadNotifications.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="w-32 h-32 opacity-40 mb-4">
                <Image
                  src="/images/no-notification.jpg"
                  height={200}
                  width={200}
                  alt="No new notification!"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-center text-sm font-medium text-gray-600">
                All caught up!
              </p>
              <p className="text-center text-xs text-gray-500 mt-1">
                No new notifications at the moment
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              <AnimatePresence initial={false} mode="popLayout">
                {unreadNotifications.map((notify: any) => (
                  <NotificationItem
                    key={notify.id}
                    notify={notify}
                    onDismiss={(id) => markAsReadMutation.mutate(id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationSideBar;
