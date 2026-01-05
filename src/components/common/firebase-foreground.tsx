"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { toast } from "sonner";
import { getFirebaseMessaging } from "@/lib/firebase";

export default function FirebaseForegroundListener() {
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload) => {
        const title =
          payload.notification?.title ||
          payload.data?.title ||
          "New Notification";

        const body =
          payload.notification?.body ||
          payload.data?.body ||
          "";

        const notificationData = {
          id: payload.data?.notificationId || payload.messageId || Date.now().toString(),
          title,
          body,
          type: payload.data?.type || "NOTIFICATION",
          clickAction: payload.data?.click_action || payload.data?.clickAction,
          timestamp: Date.now(),
        };

        // Show the new popup notification
        if (typeof window !== "undefined" && (window as any).showNotificationPopup) {
          (window as any).showNotificationPopup(notificationData);
        }

        // Also show a small toast for quick awareness
        if (typeof document !== "undefined" && document.visibilityState === "visible") {
          toast(title, {
            description: body,
            duration: 3000,
            action: notificationData.clickAction
              ? {
                label: "View",
                onClick: () => {
                  if (notificationData.clickAction?.startsWith("/")) {
                    window.location.href = notificationData.clickAction;
                  } else {
                    window.open(notificationData.clickAction, "_blank");
                  }
                },
              }
              : undefined,
          });
        }

        // Show browser notification if permission is granted
        if (Notification.permission === "granted") {
          const browserNotification = new Notification(title, {
            body,
            data: notificationData,
          });

          // Handle click on browser notification
          browserNotification.onclick = () => {
            window.focus();
            if (notificationData.clickAction) {
              if (notificationData.clickAction.startsWith("/")) {
                window.location.href = notificationData.clickAction;
              } else {
                window.open(notificationData.clickAction, "_blank");
              }
            }
            browserNotification.close();
          };
        }
      });
    };

    init();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return null;
}
