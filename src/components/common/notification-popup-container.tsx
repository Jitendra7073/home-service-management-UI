"use client";

import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import NotificationPopup, {
  NotificationData,
} from "./notification-popup";

interface NotificationQueueItem extends NotificationData {
  internalId: string;
}

const NotificationPopupContainer = () => {
  const [notifications, setNotifications] = useState<NotificationQueueItem[]>(
    []
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Maximum number of notifications to show at once
  const MAX_NOTIFICATIONS = 3;

  const addNotification = useCallback((notification: NotificationData) => {
    const internalId = `${notification.id}-${Date.now()}`;

    setNotifications((prev) => {
      const newNotifications = [
        { ...notification, internalId },
        ...prev,
      ] as NotificationQueueItem[];

      // Keep only the most recent MAX_NOTIFICATIONS
      return newNotifications.slice(0, MAX_NOTIFICATIONS);
    });
  }, []);

  const removeNotification = useCallback((internalId: string) => {
    setNotifications((prev) =>
      prev.filter((n) => n.internalId !== internalId)
    );
  }, []);

  const handleNotificationClick = useCallback((notification: NotificationQueueItem) => {
    if (notification.clickAction) {
      // Check if it's a relative path or absolute URL
      if (notification.clickAction.startsWith("/")) {
        // Navigate using Next.js router
        window.location.href = notification.clickAction;
      } else {
        // Open in new tab
        window.open(notification.clickAction, "_blank");
      }
    }
  }, []);

  // Expose the addNotification function to the window object for global access
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).showNotificationPopup = addNotification;
    }
  }, [addNotification]);

  if (!isMounted) {
    return null;
  }

  const portalRoot = document.getElementById("notification-root");

  if (!portalRoot) {
    return null;
  }

  return createPortal(
    <div className="fixed bottom-4 right-4 z-9999 flex flex-col items-end pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.internalId}
            layout
            className="pointer-events-auto"
          >
            <NotificationPopup
              notification={notification}
              onClose={() => removeNotification(notification.internalId)}
              onClick={() => handleNotificationClick(notification)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    portalRoot
  );
};

export default NotificationPopupContainer;
