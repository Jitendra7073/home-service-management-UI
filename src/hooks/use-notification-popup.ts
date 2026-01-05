"use client";

import { useCallback } from "react";

export interface NotificationData {
  id?: string;
  title: string;
  body: string;
  type?: string;
  clickAction?: string;
  timestamp?: number;
}

/**
 * Hook to show notification popups from anywhere in the app
 *
 * @example
 * const { showNotification } = useNotificationPopup();
 *
 * showNotification({
 *   title: "Booking Confirmed",
 *   body: "Your service has been booked successfully",
 *   type: "BOOKING_CONFIRMED",
 *   clickAction: "/customer/bookings"
 * });
 */
export const useNotificationPopup = () => {
  const showNotification = useCallback((notification: NotificationData) => {
    if (typeof window !== "undefined" && (window as any).showNotificationPopup) {
      (window as any).showNotificationPopup({
        id: notification.id || Date.now().toString(),
        ...notification,
      });
    } else {
      console.warn("Notification popup system not available");
    }
  }, []);

  return { showNotification };
};

/**
 * Global function to show notifications from non-React code
 * Can be called from anywhere in the application
 *
 * @example
 * showGlobalNotification({
 *   title: "New Message",
 *   body: "You have a new message from support",
 *   type: "MESSAGE"
 * });
 */
export const showGlobalNotification = (notification: NotificationData) => {
  if (typeof window !== "undefined" && (window as any).showNotificationPopup) {
    (window as any).showNotificationPopup({
      id: notification.id || Date.now().toString(),
      ...notification,
    });
  }
};

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    showNotificationPopup?: (notification: NotificationData) => void;
  }
}

export default useNotificationPopup;
